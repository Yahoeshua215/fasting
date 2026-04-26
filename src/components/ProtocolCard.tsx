import { useState } from 'react';
import { useFastStore } from '@/store/useFastStore';
import type { Protocol } from '@/lib/protocols';

interface ProtocolCardProps {
  protocol: Protocol;
}

export function ProtocolCard({ protocol }: ProtocolCardProps) {
  const settings = useFastStore(s => s.settings);
  const patchSettings = useFastStore(s => s.patchSettings);
  const isDefault = (settings.defaultProtocol ?? '18:6') === protocol.id;
  const [confirmedSupervision, setConfirmedSupervision] = useState(false);
  const blocked = !!protocol.requiresSupervision && !confirmedSupervision;

  async function setAsDefault() {
    if (blocked) return;
    await patchSettings({ defaultProtocol: protocol.id });
  }

  return (
    <article className="card flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{protocol.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="pill">{protocol.hours}h fast</span>
            {protocol.eatingHours ? (
              <span className="pill">{protocol.eatingHours}h eat</span>
            ) : null}
            <span className="pill">{protocol.cadence}</span>
            {protocol.requiresSupervision ? (
              <span className="pill border-rose-700/60 text-rose-200">Supervision</span>
            ) : null}
            {isDefault ? (
              <span className="pill border-cyan-700/60 text-cyan-200">Your default</span>
            ) : null}
          </div>
        </div>
      </header>
      <p className="text-sm text-slate-300">{protocol.blurb}</p>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <div className="label mb-1">What's happening</div>
          <p className="text-slate-300">{protocol.whatHappens}</p>
        </div>
        <div>
          <div className="label mb-1">Who it's for</div>
          <p className="text-slate-300">{protocol.forWho}</p>
        </div>
      </div>
      <div>
        <div className="label mb-1">Who it's not for</div>
        <p className="text-sm text-slate-400">{protocol.notFor}</p>
      </div>

      {protocol.requiresSupervision ? (
        <label className="flex items-start gap-2 rounded-xl border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-100">
          <input
            type="checkbox"
            checked={confirmedSupervision}
            onChange={e => setConfirmedSupervision(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-rose-400"
          />
          <span>
            I have a physician supervising this fast and have reviewed any medication
            adjustments (insulin, sulfonylureas, blood-pressure meds) with them.
          </span>
        </label>
      ) : null}

      <div className="mt-1 flex items-center gap-2">
        <button
          className={isDefault ? 'btn-ghost' : 'btn-primary'}
          disabled={isDefault || blocked}
          onClick={() => void setAsDefault()}
        >
          {isDefault ? 'Current default' : `Set ${protocol.name} as default`}
        </button>
      </div>
    </article>
  );
}
