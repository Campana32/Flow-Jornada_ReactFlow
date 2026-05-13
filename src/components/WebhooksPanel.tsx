"use client";

import { useState } from "react";
import CollapsedPanelBar from "./CollapsedPanelBar";
import { NodeIconImg } from "@/lib/nodeConfig";

export interface WebhooksNodeData {
  nome: string;
  metodo: string;
  url: string;
  payloadMode: "simplificado" | "avancado";
  payloadSimplificado: {
    idJornada: boolean;
    idStep: boolean;
    dadosLead: boolean;
    parametros: { chave: string; valor: string }[];
  };
  payloadAvancado: { body: string; headers: string };
  continuarComErro: boolean;
}

interface WebhooksPanelProps {
  onClose: () => void;
  onAdd: (data: WebhooksNodeData) => void;
  onRemove?: () => void;
  initialData?: Partial<WebhooksNodeData>;
}

const COLOR = "#75ab21";

const METODOS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/* ── Icons ── */
const IcClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12M10 4l6 6-6 6" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcAdd = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IcWebhook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#343b44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 16.98h-5.99c-1.1 0-1.95.68-2.23 1.61m0 0A3.5 3.5 0 1 1 6.2 14.6M6.2 14.6A3.5 3.5 0 0 1 9.5 8.8m0 0V4m0 4.8 3.3 3.7M16.5 7a3.5 3.5 0 1 0-7 0" />
  </svg>
);
const IcTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6f7680" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const NodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3332 20.6666H21.1732C21.5332 20.2533 22.0665 19.9999 22.6665 19.9999C23.7732 19.9999 24.6665 20.8933 24.6665 21.9999C24.6665 23.1066 23.7732 23.9999 22.6665 23.9999C22.0798 23.9999 21.5465 23.7466 21.1732 23.3333H15.8665C15.2532 26.3733 12.5598 28.6666 9.33317 28.6666C5.65317 28.6666 2.6665 25.6799 2.6665 21.9999C2.6665 18.7733 4.95984 16.0799 7.99984 15.4666V18.2266C6.45317 18.7733 5.33317 20.2666 5.33317 21.9999C5.33317 24.1999 7.13317 25.9999 9.33317 25.9999C11.5332 25.9999 13.3332 24.1999 13.3332 21.9999V20.6666ZM16.6665 5.99992C18.8665 5.99992 20.6665 7.79992 20.6665 9.99992H23.3332C23.3332 6.31992 20.3465 3.33325 16.6665 3.33325C12.9865 3.33325 9.99984 6.31992 9.99984 9.99992C9.99984 11.9066 10.7998 13.6133 12.0665 14.8266L8.93317 20.0266C8.0265 20.2133 7.33317 21.0266 7.33317 21.9999C7.33317 23.1066 8.2265 23.9999 9.33317 23.9999C10.4398 23.9999 11.3332 23.1066 11.3332 21.9999C11.3332 21.7866 11.3065 21.5866 11.2398 21.3999L15.7465 13.8933C13.9865 13.4799 12.6665 11.8933 12.6665 9.99992C12.6665 7.79992 14.4665 5.99992 16.6665 5.99992ZM22.6665 17.9999C21.8132 17.9999 21.0265 18.2666 20.3732 18.7199L16.3065 11.9599C15.3732 11.7999 14.6665 10.9866 14.6665 9.99992C14.6665 8.89325 15.5598 7.99992 16.6665 7.99992C17.7732 7.99992 18.6665 8.89325 18.6665 9.99992C18.6665 10.1999 18.6398 10.3866 18.5865 10.5733L21.5065 15.4399C21.8798 15.3733 22.2665 15.3333 22.6665 15.3333C26.3465 15.3333 29.3332 18.3199 29.3332 21.9999C29.3332 25.6799 26.3465 28.6666 22.6665 28.6666C20.1998 28.6666 18.0398 27.3199 16.8932 25.3333H20.4532C21.0932 25.7599 21.8532 25.9999 22.6665 25.9999C24.8665 25.9999 26.6665 24.1999 26.6665 21.9999C26.6665 19.7999 24.8665 17.9999 22.6665 17.9999Z" fill="white"/>
  </svg>
);

/* ── Sub-components ── */
const inputClass =
  "w-full rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm text-[#12171d] placeholder:text-[#6f7680] outline-none focus:border-[#2724ed] transition-colors h-[40px]";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="text-sm font-medium text-[#343b44]">{children}</span>
      {required && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#d92d20">
          <path d="M4 0L4.9 2.8L7.6 1.4L6.2 4L9 4.9L6.2 5.8L7.6 8.4L4.9 7L4 9.8L3.1 7L0.4 8.4L1.8 5.8L-1 4.9L1.8 4L0.4 1.4L3.1 2.8Z" />
        </svg>
      )}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex gap-[8px] items-start cursor-pointer select-none">
      <div className="flex items-center pt-[2px] shrink-0">
        <div
          onClick={() => onChange(!checked)}
          className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
            checked ? "bg-[#2724ed] border-[#2724ed]" : "border-[#d2d6db] bg-white"
          }`}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[#343b44]">{label}</span>
        {description && <span className="text-sm text-[#4c535c]">{description}</span>}
      </div>
    </label>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#e8eaec] rounded-[8px] overflow-hidden shrink-0">
      <div className="bg-[#fcfcfc] border-b border-[#e8eaec] flex items-center px-[12px] h-[44px]">
        <span className="text-sm font-medium text-[#12171d]">
          {title}
          {subtitle && <span className="font-normal text-[#4c535c] text-xs ml-1">{subtitle}</span>}
        </span>
      </div>
      <div className="p-[16px] flex flex-col gap-[16px] bg-white">{children}</div>
    </div>
  );
}

/* ── Main component ── */
export default function WebhooksPanel({ onClose, onAdd, onRemove, initialData }: WebhooksPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  /* Identificação */
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [metodo, setMetodo] = useState(initialData?.metodo ?? "POST");
  const [url, setUrl] = useState(initialData?.url ?? "");

  /* Payload */
  const [payloadMode, setPayloadMode] = useState<"simplificado" | "avancado">(
    initialData?.payloadMode ?? "simplificado"
  );
  const [idJornada, setIdJornada] = useState(initialData?.payloadSimplificado?.idJornada ?? false);
  const [idStep, setIdStep] = useState(initialData?.payloadSimplificado?.idStep ?? false);
  const [dadosLead, setDadosLead] = useState(initialData?.payloadSimplificado?.dadosLead ?? false);
  const [parametros, setParametros] = useState<{ chave: string; valor: string }[]>(
    initialData?.payloadSimplificado?.parametros ?? []
  );
  const [bodyText, setBodyText] = useState(initialData?.payloadAvancado?.body ?? "");
  const [headersText, setHeadersText] = useState(initialData?.payloadAvancado?.headers ?? "");
  const [avancadoTab, setAvancadoTab] = useState<"body" | "headers">("body");

  /* Comportamento em erro */
  const [continuarComErro, setContinuarComErro] = useState(initialData?.continuarComErro ?? false);

  if (collapsed) {
    return (
      <CollapsedPanelBar
        title="Webhooks"
        color={COLOR}
        icon={<NodeIconImg type="webhooks" size={32} />}
        onExpand={() => setCollapsed(false)}
        onClose={onClose}
      />
    );
  }

  const canAdd = nome.trim().length > 0 && url.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      nome: nome.trim(),
      metodo,
      url: url.trim(),
      payloadMode,
      payloadSimplificado: { idJornada, idStep, dadosLead, parametros },
      payloadAvancado: { body: bodyText, headers: headersText },
      continuarComErro,
    });
  };

  const addParametro = () => setParametros((p) => [...p, { chave: "", valor: "" }]);
  const removeParametro = (i: number) => setParametros((p) => p.filter((_, idx) => idx !== i));
  const updateParametro = (i: number, field: "chave" | "valor", val: string) =>
    setParametros((p) => p.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  return (
    <div
      className="fixed z-50 flex flex-col rounded-[12px] overflow-hidden border border-[#e8eaec] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(39,44,55,0.08)]"
      style={{ bottom: "24px", right: "24px", width: 660, height: "79vh" }}
    >
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[#e8eaec] shrink-0">
        <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 52, height: 52, background: COLOR }}>
          <NodeIcon />
        </div>
        <span className="flex-1 text-lg font-semibold text-[#12171d]">Webhooks</span>
        <button onClick={() => setCollapsed(true)} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcArrowRight />
        </button>
        <div className="w-px h-[24px] bg-[#e8eaec]" />
        <button onClick={onClose} className="flex items-center justify-center size-[36px] rounded-[8px] hover:bg-gray-100 transition-colors">
          <IcClose />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-[20px] flex flex-col gap-[12px]">

        {/* ── Identificação ── */}
        <Section title="Identificação">
          {/* Nome */}
          <div className="flex flex-col gap-[6px]" style={{ maxWidth: 320 }}>
            <Label required>Nome</Label>
            <input
              className={inputClass}
              placeholder="Ex: Notificar CRM"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          {/* Método + URL */}
          <div className="flex flex-col gap-[6px]">
            <Label required>Método + URL</Label>
            <div className="flex gap-[8px] items-center">
              {/* Método select */}
              <div className="relative shrink-0" style={{ width: 146 }}>
                <select
                  className={`${inputClass} appearance-none pr-[28px] cursor-pointer`}
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                >
                  {METODOS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              {/* URL input */}
              <input
                className={`${inputClass} flex-1`}
                placeholder="https://www.exemplo.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {/* Testar button */}
              <button
                type="button"
                className="flex items-center gap-[6px] shrink-0 rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[14px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors h-[40px]"
              >
                <IcWebhook />
                Testar
              </button>
            </div>
          </div>
        </Section>

        {/* ── Payload ── */}
        <Section title="Payload" subtitle="(Body da requisição)">
          {/* Tabs Simplificado / Avançado */}
          <div className="flex gap-[8px]">
            {(["simplificado", "avancado"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPayloadMode(mode)}
                className={`h-[36px] px-[12px] py-[8px] rounded-[6px] text-sm font-semibold transition-colors ${
                  payloadMode === mode
                    ? "bg-[#f2f4ff] text-[#2724ed]"
                    : "text-[#6f7680] hover:bg-gray-50"
                }`}
              >
                {mode === "simplificado" ? "Simplificado" : "Avançado"}
              </button>
            ))}
          </div>

          {payloadMode === "simplificado" && (
            <>
              {/* Checkboxes */}
              <div className="flex gap-[8px]">
                {[
                  { key: "idJornada", label: "ID da jornada", val: idJornada, set: setIdJornada },
                  { key: "idStep", label: "ID do step", val: idStep, set: setIdStep },
                  { key: "dadosLead", label: "Dados do lead", val: dadosLead, set: setDadosLead },
                ].map(({ key, label, val, set }) => (
                  <div key={key} className="flex-1 border border-[#e8eaec] rounded-[8px] p-[16px]">
                    <Checkbox checked={val} onChange={set} label={label} />
                  </div>
                ))}
              </div>

              {/* Parâmetros extras */}
              {parametros.length > 0 && (
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] text-xs font-medium text-[#6f7680] px-[2px]">
                    <span className="flex-1">Chave</span>
                    <span className="flex-1">Valor</span>
                    <span className="w-[24px]" />
                  </div>
                  {parametros.map((p, i) => (
                    <div key={i} className="flex items-center gap-[8px]">
                      <input
                        className={`${inputClass} flex-1`}
                        placeholder="chave"
                        value={p.chave}
                        onChange={(e) => updateParametro(i, "chave", e.target.value)}
                      />
                      <input
                        className={`${inputClass} flex-1`}
                        placeholder="valor"
                        value={p.valor}
                        onChange={(e) => updateParametro(i, "valor", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeParametro(i)}
                        className="flex items-center justify-center w-[24px] h-[24px] rounded hover:bg-gray-100 transition-colors"
                      >
                        <IcTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-px bg-[#e8eaec]" />

              {/* Botão Adicionar parâmetro */}
              <button
                type="button"
                onClick={addParametro}
                className="flex items-center gap-[4px] rounded-[8px] border border-[#e8eaec] bg-[#fcfcfc] px-[12px] py-[8px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors self-start"
              >
                <IcAdd />
                Adicionar parâmetro
              </button>
            </>
          )}

          {payloadMode === "avancado" && (
            <>
              {/* Checkboxes (mesmo do simplificado) */}
              <div className="flex gap-[8px]">
                {[
                  { key: "idJornada", label: "ID da jornada", val: idJornada, set: setIdJornada },
                  { key: "idStep", label: "ID do step", val: idStep, set: setIdStep },
                  { key: "dadosLead", label: "Dados do lead", val: dadosLead, set: setDadosLead },
                ].map(({ key, label, val, set }) => (
                  <div key={key} className="flex-1 border border-[#e8eaec] rounded-[8px] p-[16px]">
                    <Checkbox checked={val} onChange={set} label={label} />
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#e8eaec]" />

              {/* Editor Body / Headers */}
              <div className="border border-[#e8eaec] rounded-[8px] p-[12px] flex flex-col gap-[10px]">
                <div className="flex gap-[0px] border-b border-[#e8eaec]">
                  {(["body", "headers"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setAvancadoTab(tab)}
                      className={`px-[4px] pb-[12px] text-sm font-semibold mr-[12px] transition-colors ${
                        avancadoTab === tab
                          ? "text-[#2724ed] border-b-2 border-[#97abff]"
                          : "text-[#6f7680]"
                      }`}
                    >
                      {tab === "body" ? "Body" : "Headers"}
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full h-[200px] resize-none rounded-[6px] bg-white border-0 outline-none text-sm font-mono text-[#12171d] placeholder:text-[#6f7680] p-[4px]"
                  placeholder={avancadoTab === "body" ? '{\n  "chave": "valor"\n}' : 'Content-Type: application/json'}
                  value={avancadoTab === "body" ? bodyText : headersText}
                  onChange={(e) =>
                    avancadoTab === "body"
                      ? setBodyText(e.target.value)
                      : setHeadersText(e.target.value)
                  }
                />
              </div>
            </>
          )}
        </Section>

        {/* ── Comportamento em erro ── */}
        <div className="border border-[#e8eaec] rounded-[8px] overflow-hidden shrink-0">
          <div className="bg-[#fcfcfc] border-b border-[#e8eaec] flex items-center px-[12px] h-[44px]">
            <span className="text-sm font-medium text-[#12171d]">Comportamento em erro</span>
          </div>
          <div className="p-[16px] bg-white">
            <Checkbox
              checked={continuarComErro}
              onChange={setContinuarComErro}
              label="Continuar jornada com erro"
              description="O lead avança se o webhook falhar"
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-[20px] py-[14px] border-t border-[#e8eaec] shrink-0 bg-white">
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-[#d92d20] hover:opacity-80 transition-opacity">
            Remover nó
          </button>
        ) : <div />}
        <div className="flex items-center gap-[12px]">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e8eaec] px-[16px] py-[9px] text-sm font-semibold text-[#343b44] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`rounded-[8px] px-[16px] py-[9px] text-sm font-semibold transition-colors ${
              canAdd
                ? "bg-[#2724ed] text-white hover:opacity-90 cursor-pointer"
                : "bg-[#f8f8f9] text-[#9ca3af] border border-[#e8eaec] cursor-not-allowed"
            }`}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
