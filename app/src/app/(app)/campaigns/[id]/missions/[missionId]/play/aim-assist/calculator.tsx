"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { resolveShootingAction } from "../actions";
import type { CombatantKind, PlayCombatant } from "../load-play-data";
import {
  type Cover,
  type GrenadeShootRollResult,
  type ShooterTotalResult,
  type StandardAttackResult,
  type TargetTotalResult,
  computeGrenadeShootRoll,
  computeScatter,
  computeShooterTotal,
  computeTargetTotal,
  FRAGMENTATION_ATTACK_BONUS,
  parseWeaponDamageModifier,
  resolveStandardAttack,
} from "./engine";

type AttackType = "standard" | "flamethrower" | "grenade";

function combatantKey(kind: CombatantKind, id: string): string {
  return `${kind}:${id}`;
}

function findCombatant(combatants: PlayCombatant[], key: string): PlayCombatant | undefined {
  const [kind, id] = key.split(":");
  return combatants.find((c) => c.kind === kind && c.id === id);
}

const roleLabel: Record<CombatantKind, string> = { captain: "Captain", first_mate: "First Mate", soldier: "Soldier" };

export function AimAssistCalculator({
  campaignId,
  missionId,
  roundNumber,
  combatants,
  onResolved,
}: {
  campaignId: string;
  missionId: string;
  roundNumber: number;
  combatants: PlayCombatant[];
  onResolved: () => void;
}) {
  const [attackType, setAttackType] = useState<AttackType>("standard");
  const [shooterKey, setShooterKey] = useState("");
  const [weaponId, setWeaponId] = useState("");
  const [damageModifierOverride, setDamageModifierOverride] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [clearedJam, setClearedJam] = useState(false);
  const [shooterRoll, setShooterRoll] = useState("");

  const [targetKey, setTargetKey] = useState("");
  const [isInCombat, setIsInCombat] = useState(false);
  const [interveningTerrain, setInterveningTerrain] = useState(0);
  const [cover, setCover] = useState<Cover>("none");
  const [isLarge, setIsLarge] = useState(false);
  const [targetRoll, setTargetRoll] = useState("");

  // Grenade-specific
  const [targetPointInLOS, setTargetPointInLOS] = useState(false);
  const [firedWithLauncher, setFiredWithLauncher] = useState(false);
  const [grenadeRoll, setGrenadeRoll] = useState("");
  const [grenadeType, setGrenadeType] = useState<"smoke" | "fragmentation">("fragmentation");

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const shooter = shooterKey ? findCombatant(combatants, shooterKey) : undefined;
  const target = targetKey ? findCombatant(combatants, targetKey) : undefined;

  const weapons = useMemo(() => (shooter ? shooter.gear.filter((g) => g.category === "weapon" || g.category === "advanced_weapon") : []), [shooter]);

  function selectWeapon(id: string) {
    setWeaponId(id);
    const weapon = weapons.find((w) => w.id === id);
    setDamageModifierOverride(parseWeaponDamageModifier(weapon?.damageModifier ?? null) ?? 0);
  }

  const shooterResult: ShooterTotalResult | null =
    shooter && shooterRoll !== "" ? computeShooterTotal({ ...shooter, hasMovedThisActivation: hasMoved, clearedJamThisActivation: clearedJam }, Number(shooterRoll)) : null;

  const targetResult: TargetTotalResult | null =
    target && targetRoll !== ""
      ? computeTargetTotal(
          {
            ...target,
            isLarge,
            isInCombat,
            interveningTerrainCount: interveningTerrain,
            cover,
          },
          Number(targetRoll)
        )
      : null;

  const standardResult: StandardAttackResult | null =
    shooterResult && targetResult && target
      ? resolveStandardAttack({
          shooterTotal: shooterResult.total,
          targetTotal: targetResult.total,
          targetAutoMiss: targetResult.isAutoMiss,
          targetInstantKill: targetResult.instantKill,
          isCriticalHit: shooterResult.isCriticalHit,
          targetArmour: target.armour,
          weaponDamageModifier: damageModifierOverride,
          targetCurrentHealth: target.currentHealth,
          targetIsRobot: target.isRobot,
        })
      : null;

  const grenadeRollResult: GrenadeShootRollResult | null =
    grenadeRoll !== ""
      ? computeGrenadeShootRoll({ roll: Number(grenadeRoll), targetPointInLOS, hastyShot: hasMoved, firedWithLauncher })
      : null;

  function resetForNextTarget() {
    setTargetKey("");
    setIsInCombat(false);
    setInterveningTerrain(0);
    setCover("none");
    setIsLarge(false);
    setTargetRoll("");
  }

  function resetAll() {
    setAttackType("standard");
    setShooterKey("");
    setWeaponId("");
    setDamageModifierOverride(0);
    setHasMoved(false);
    setClearedJam(false);
    setShooterRoll("");
    resetForNextTarget();
    setTargetPointInLOS(false);
    setFiredWithLauncher(false);
    setGrenadeRoll("");
    setGrenadeType("fragmentation");
  }

  function saveStandardResolution(attack: "standard" | "flamethrower" | "grenade_fragmentation", weaponIdForLog: string | null, isFirstJamCandidate: boolean) {
    if (!shooter || !target || !shooterResult || !targetResult || !standardResult) return;
    setError(null);
    startTransition(async () => {
      const result = await resolveShootingAction({
        campaignId,
        missionId,
        roundNumber,
        shooterCrewId: shooter.crewId,
        shooterKind: shooter.kind,
        shooterId: shooter.id,
        targetCrewId: target.crewId,
        targetKind: target.kind,
        targetId: target.id,
        attackType: attack,
        weaponEquipmentItemId: weaponIdForLog,
        rollDetails: {
          shooterBreakdown: shooterResult.breakdown,
          targetBreakdown: targetResult.breakdown,
          shooterRoll: Number(shooterRoll),
          targetRoll: Number(targetRoll),
        },
        result: standardResult.hit && standardResult.damage > 0 ? "hit" : standardResult.hit ? "hit" : "miss",
        damage: standardResult.hit ? standardResult.damage : null,
        targetBecomesStunned: standardResult.becomesStunned,
        targetBecomesWounded: standardResult.becomesWounded,
        targetDied: standardResult.dies,
        shooterWeaponJammed: isFirstJamCandidate && shooterResult.isJam,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (attack === "standard") {
        onResolved();
      } else {
        resetForNextTarget();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <h2 className="font-display text-lg font-semibold tracking-[0.05em] text-text-default uppercase">Aim Assist</h2>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="font-mono text-[13px] tracking-[0.08em] text-text-secondary uppercase">Angriffsart</legend>
        <div className="flex gap-1.5">
          {(["standard", "flamethrower", "grenade"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setAttackType(type);
                resetForNextTarget();
              }}
              className={`px-2.5 py-1 font-mono text-[13px] uppercase ${
                attackType === type ? "border border-corp-accent bg-corp-accent/20 text-corp-accent" : "border border-border text-text-secondary"
              }`}
            >
              {type === "standard" ? "Standard" : type === "flamethrower" ? "Flamethrower" : "Grenade"}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-xs text-text-secondary">
        Schütze
        <select
          value={shooterKey}
          onChange={(e) => {
            setShooterKey(e.target.value);
            setWeaponId("");
          }}
          className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
        >
          <option value="">-- wählen --</option>
          {combatants.map((c) => (
            <option key={combatantKey(c.kind, c.id)} value={combatantKey(c.kind, c.id)}>
              {c.crewName} · {c.name} ({roleLabel[c.kind]})
            </option>
          ))}
        </select>
      </label>

      {shooter && (attackType === "standard" || attackType === "flamethrower") ? (
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          Waffe
          <select value={weaponId} onChange={(e) => selectWeapon(e.target.value)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default">
            <option value="">-- wählen --</option>
            {weapons.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} {w.damageModifier ? `(${w.damageModifier})` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {shooter && (attackType === "standard" || attackType === "flamethrower") ? (
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          Damage-Modifikator (manuell überschreibbar)
          <input
            type="number"
            value={damageModifierOverride}
            onChange={(e) => setDamageModifierOverride(Number(e.target.value))}
            className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
          />
        </label>
      ) : null}

      {shooter ? (
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" checked={hasMoved} onChange={(e) => setHasMoved(e.target.checked)} className="accent-corp-accent" />
            Hasty Shot (bewegt)
          </label>
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" checked={clearedJam} onChange={(e) => setClearedJam(e.target.checked)} className="accent-corp-accent" />
            Cleared Jam
          </label>
          {shooter.isStunned ? <span className="text-xs text-danger">Schütze ist Stunned</span> : null}
          {shooter.weaponJammed ? <span className="text-xs text-danger">Waffe war blockiert (Jam)</span> : null}
        </div>
      ) : null}

      {(attackType === "standard" || attackType === "flamethrower") && shooter ? (
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          Schützenwurf (1d20)
          <input
            type="number"
            min={1}
            max={20}
            value={shooterRoll}
            onChange={(e) => setShooterRoll(e.target.value)}
            className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
          />
        </label>
      ) : null}

      {shooterResult ? (
        <div className="border border-border bg-bg-raised p-2 text-xs text-text-secondary">
          <p>
            Schützen-Gesamt: <span className="font-semibold text-text-default">{shooterResult.total}</span>
            {shooterResult.isCriticalHit ? <span className="ml-2 text-corp-accent">CRIT</span> : null}
            {shooterResult.isJam ? <span className="ml-2 text-danger">JAM</span> : null}
          </p>
        </div>
      ) : null}

      {attackType === "standard" || attackType === "flamethrower" ? (
        <>
          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            Ziel
            <select value={targetKey} onChange={(e) => setTargetKey(e.target.value)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default">
              <option value="">-- wählen --</option>
              {combatants
                .filter((c) => combatantKey(c.kind, c.id) !== shooterKey)
                .map((c) => (
                  <option key={combatantKey(c.kind, c.id)} value={combatantKey(c.kind, c.id)}>
                    {c.crewName} · {c.name} ({roleLabel[c.kind]}) -- {c.currentHealth}/{c.health} HP
                  </option>
                ))}
            </select>
          </label>

          {target ? (
            <>
              <label className="flex items-center gap-1.5 text-xs text-text-secondary">
                <input type="checkbox" checked={isInCombat} onChange={(e) => setIsInCombat(e.target.checked)} className="accent-corp-accent" />
                Ziel ist gerade In Combat (Zufallsziel physisch auswürfeln)
              </label>

              <div className="flex flex-wrap gap-3">
                <label className="flex flex-col gap-1 text-xs text-text-secondary">
                  Intervening Terrain (Anzahl)
                  <input
                    type="number"
                    min={0}
                    value={interveningTerrain}
                    onChange={(e) => setInterveningTerrain(Number(e.target.value))}
                    className="w-24 rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-text-secondary">
                  Cover
                  <select value={cover} onChange={(e) => setCover(e.target.value as Cover)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default">
                    <option value="none">Kein Cover</option>
                    <option value="light">Light Cover (+2)</option>
                    <option value="heavy">Heavy Cover (+4)</option>
                  </select>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-text-secondary self-end pb-2">
                  <input type="checkbox" checked={isLarge} onChange={(e) => setIsLarge(e.target.checked)} className="accent-corp-accent" />
                  Large Target
                </label>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                {target.isStunned ? <span className="text-corp-accent">Stunned (+2 automatisch)</span> : null}
                {!target.isRobot && target.currentHealth > 0 && target.currentHealth <= 4 ? <span className="text-corp-accent">Wounded (-2 automatisch)</span> : null}
                {target.lostEyeStacks >= 1 ? <span className="text-corp-accent">Lost Eye ({target.lostEyeStacks}x)</span> : null}
                {target.isRobot ? <span>Robot (kein Wounded-Malus)</span> : null}
              </div>

              <label className="flex flex-col gap-1 text-xs text-text-secondary">
                Zielwurf (1d20)
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={targetRoll}
                  onChange={(e) => setTargetRoll(e.target.value)}
                  className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
                />
              </label>

              {targetResult ? (
                <div className="border border-border bg-bg-raised p-2 text-xs text-text-secondary">
                  <p>
                    Ziel-Gesamt: <span className="font-semibold text-text-default">{targetResult.total}</span>
                    {targetResult.isAutoMiss ? <span className="ml-2 text-corp-accent">Nat. 20 -- Fehlschuss garantiert</span> : null}
                    {targetResult.instantKill ? <span className="ml-2 text-danger">Lost Eye (2. Stack) -- automatischer Tod</span> : null}
                  </p>
                </div>
              ) : null}

              {standardResult ? (
                <div className="border border-corp-accent/40 bg-bg-raised p-3 text-sm">
                  {standardResult.hit ? (
                    <>
                      <p className="font-semibold text-text-default">💥 Treffer -- {standardResult.damage} Schaden</p>
                      <p className="mt-1 text-xs text-text-secondary">
                        Health danach: {standardResult.resultingHealth}/{target.health}
                        {standardResult.becomesStunned ? " · wird Stunned" : ""}
                        {standardResult.becomesWounded ? " · wird Wounded" : ""}
                        {standardResult.dies ? " · STIRBT" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-text-default">Fehlschuss</p>
                  )}
                </div>
              ) : null}

              {error ? <p className="text-sm text-danger">{error}</p> : null}

              {standardResult ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    disabled={pending}
                    onClick={() => saveStandardResolution(attackType === "flamethrower" ? "flamethrower" : "standard", weaponId || null, true)}
                  >
                    {pending ? "Speichere…" : "Ergebnis speichern"}
                  </Button>
                  {attackType === "flamethrower" ? (
                    <button type="button" onClick={resetForNextTarget} className="text-sm text-text-secondary hover:text-text-default">
                      Weitere getroffene Figur
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}

      {attackType === "grenade" ? (
        <>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 text-xs text-text-secondary">
              <input type="checkbox" checked={targetPointInLOS} onChange={(e) => setTargetPointInLOS(e.target.checked)} className="accent-corp-accent" />
              Zielpunkt in LOS (+2)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-text-secondary">
              <input type="checkbox" checked={hasMoved} onChange={(e) => setHasMoved(e.target.checked)} className="accent-corp-accent" />
              Hasty Shot (-1)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-text-secondary">
              <input type="checkbox" checked={firedWithLauncher} onChange={(e) => setFiredWithLauncher(e.target.checked)} className="accent-corp-accent" />
              Grenade Launcher (-1)
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            Shoot Roll (TN12, 1d20)
            <input
              type="number"
              min={1}
              max={20}
              value={grenadeRoll}
              onChange={(e) => setGrenadeRoll(e.target.value)}
              className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default"
            />
          </label>

          {grenadeRollResult ? (
            <div className="border border-border bg-bg-raised p-2 text-xs text-text-secondary">
              <p>
                Gesamt: <span className="font-semibold text-text-default">{grenadeRollResult.total}</span> (TN {12})
                {grenadeRollResult.meetsTN ? <span className="ml-2 text-corp-accent">Erfolg</span> : <span className="ml-2 text-danger">Verfehlt</span>}
                {grenadeRollResult.isJam ? <span className="ml-2 text-danger">JAM (Launcher)</span> : null}
              </p>
              {!grenadeRollResult.meetsTN ? (
                <p className="mt-1">{(() => {
                  const scatter = computeScatter(12 - grenadeRollResult.total);
                  return scatter.completeMiss
                    ? "Kompletter Fehlschlag -- kein Effekt."
                    : `Verschiebt sich um ${scatter.scatterInches}\" (physisch auf dem Tisch verschieben).`;
                })()}</p>
              ) : null}
            </div>
          ) : null}

          {grenadeRollResult && (grenadeRollResult.meetsTN || computeScatter(12 - grenadeRollResult.total).scattered) ? (
            <>
              <fieldset className="flex gap-1.5">
                <legend className="font-mono text-[13px] tracking-[0.08em] text-text-secondary uppercase">Typ</legend>
                {(["fragmentation", "smoke"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGrenadeType(t)}
                    className={`px-2.5 py-1 font-mono text-[13px] uppercase ${
                      grenadeType === t ? "border border-corp-accent bg-corp-accent/20 text-corp-accent" : "border border-border text-text-secondary"
                    }`}
                  >
                    {t === "fragmentation" ? "Fragmentation" : "Smoke"}
                  </button>
                ))}
              </fieldset>

              {grenadeType === "smoke" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-text-secondary">Rauch wird auf dem Zielpunkt platziert -- kein Schadenswurf, nichts zu speichern.</p>
                  <Button type="button" onClick={onResolved} className="self-start">
                    Fertig
                  </Button>
                </div>
              ) : (
                <>
                  <label className="flex flex-col gap-1 text-xs text-text-secondary">
                    Ziel (im 1.5″-Radius)
                    <select value={targetKey} onChange={(e) => setTargetKey(e.target.value)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default">
                      <option value="">-- wählen --</option>
                      {combatants.map((c) => (
                        <option key={combatantKey(c.kind, c.id)} value={combatantKey(c.kind, c.id)}>
                          {c.crewName} · {c.name} ({roleLabel[c.kind]}) -- {c.currentHealth}/{c.health} HP
                        </option>
                      ))}
                    </select>
                  </label>

                  {target ? (
                    <FragmentationTargetForm
                      target={target}
                      interveningTerrain={interveningTerrain}
                      setInterveningTerrain={setInterveningTerrain}
                      cover={cover}
                      setCover={setCover}
                      isLarge={isLarge}
                      setIsLarge={setIsLarge}
                      targetRoll={targetRoll}
                      setTargetRoll={setTargetRoll}
                      pending={pending}
                      error={error}
                      onSave={() => saveStandardResolution("grenade_fragmentation", null, false)}
                      onNext={resetForNextTarget}
                    />
                  ) : null}
                </>
              )}
            </>
          ) : null}
        </>
      ) : null}

      <div className="mt-2 border-t border-border pt-3">
        <button type="button" onClick={resetAll} className="text-xs text-text-secondary hover:text-text-default">
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}

function FragmentationTargetForm({
  target,
  interveningTerrain,
  setInterveningTerrain,
  cover,
  setCover,
  isLarge,
  setIsLarge,
  targetRoll,
  setTargetRoll,
  pending,
  error,
  onSave,
  onNext,
}: {
  target: PlayCombatant;
  interveningTerrain: number;
  setInterveningTerrain: (v: number) => void;
  cover: Cover;
  setCover: (v: Cover) => void;
  isLarge: boolean;
  setIsLarge: (v: boolean) => void;
  targetRoll: string;
  setTargetRoll: (v: string) => void;
  pending: boolean;
  error: string | null;
  onSave: () => void;
  onNext: () => void;
}) {
  const targetResult =
    targetRoll !== ""
      ? computeTargetTotal({ ...target, isLarge, isInCombat: false, interveningTerrainCount: interveningTerrain, cover }, Number(targetRoll))
      : null;

  const shooterTotal = FRAGMENTATION_ATTACK_BONUS;
  const standardResult: StandardAttackResult | null = targetResult
    ? resolveStandardAttack({
        shooterTotal,
        targetTotal: targetResult.total,
        targetAutoMiss: targetResult.isAutoMiss,
        targetInstantKill: targetResult.instantKill,
        isCriticalHit: false,
        targetArmour: target.armour,
        weaponDamageModifier: 0,
        targetCurrentHealth: target.currentHealth,
        targetIsRobot: target.isRobot,
      })
    : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          Intervening Terrain
          <input type="number" min={0} value={interveningTerrain} onChange={(e) => setInterveningTerrain(Number(e.target.value))} className="w-24 rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-text-secondary">
          Cover (nur Solid Cover zählt)
          <select value={cover} onChange={(e) => setCover(e.target.value as Cover)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default">
            <option value="none">Kein Cover</option>
            <option value="light">Light Cover (+2)</option>
            <option value="heavy">Heavy Cover (+4)</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-text-secondary self-end pb-2">
          <input type="checkbox" checked={isLarge} onChange={(e) => setIsLarge(e.target.checked)} className="accent-corp-accent" />
          Large Target
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-text-secondary">
        Zielwurf (1d20) -- Angriffswert Fragmentation ist fix +3
        <input type="number" min={1} max={20} value={targetRoll} onChange={(e) => setTargetRoll(e.target.value)} className="rounded-md border border-border bg-bg-body px-2 py-1.5 text-sm text-text-default" />
      </label>

      {standardResult ? (
        <div className="border border-corp-accent/40 bg-bg-raised p-3 text-sm">
          {standardResult.hit ? (
            <>
              <p className="font-semibold text-text-default">💥 Treffer -- {standardResult.damage} Schaden</p>
              <p className="mt-1 text-xs text-text-secondary">
                Health danach: {standardResult.resultingHealth}/{target.health}
                {standardResult.becomesStunned ? " · wird Stunned" : ""}
                {standardResult.becomesWounded ? " · wird Wounded" : ""}
                {standardResult.dies ? " · STIRBT" : ""}
              </p>
            </>
          ) : (
            <p className="font-semibold text-text-default">Fehlschuss</p>
          )}
        </div>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {standardResult ? (
        <div className="flex gap-2">
          <Button type="button" disabled={pending} onClick={onSave}>
            {pending ? "Speichere…" : "Ergebnis speichern"}
          </Button>
          <button type="button" onClick={onNext} className="text-sm text-text-secondary hover:text-text-default">
            Weitere getroffene Figur
          </button>
        </div>
      ) : null}
    </div>
  );
}
