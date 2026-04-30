"use client";

const imgAvatar = "https://www.figma.com/api/mcp/asset/ca02ab53-3cfc-453a-b51a-6b86d529720d";

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="#6f7680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconChevronDownSmall() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L5 5L9 1" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1V2M7 12V13M1 7H2M12 7H13M2.929 2.929L3.636 3.636M10.364 10.364L11.071 11.071M2.929 11.071L3.636 10.364M10.364 3.636L11.071 2.929M5 7C5 5.895 5.895 5 7 5C8.105 5 9 5.895 9 7C9 8.105 8.105 9 7 9C5.895 9 5 8.105 5 7Z" stroke="#12171d" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 7.5C12.1 10.08 9.65 12 6.75 12C3.16 12 0.25 9.09 0.25 5.5C0.25 2.6 2.17 0.15 4.75 0.25C3.5 1.69 3.5 4.19 5 5.5C6.5 6.81 9.06 6.5 10.5 5.5C11.69 4.69 12.5 2.75 12 1.25C13.25 2.5 13.9 4.92 13 7.5Z" fill="#a0a6ad"/>
    </svg>
  );
}

function ModeToggle() {
  return (
    <div className="flex items-center justify-between bg-[#e8eaec] rounded-full h-[24px] w-[48px] pl-[2px] pr-[4px] py-[2px]">
      <div className="flex items-center justify-center bg-surface-primary rounded-full size-[20px] shadow-sm">
        <IconSun />
      </div>
      <IconMoon />
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[72px] px-[32px] py-[20px] bg-bg-primary border-b border-border-secondary w-full shrink-0">
      {/* Left: project + dropdown */}
      <div className="flex items-center gap-[8px]">
        <span className="text-sm font-medium text-text-primary whitespace-nowrap">Projeto</span>
        <div className="flex items-center px-[5px] py-[5px]">
          <div className="flex items-center gap-[8px] bg-surface-primary border border-border-secondary rounded-[8px] h-[40px] px-[12px] py-[8px] w-[320px]">
            <span className="flex-1 text-sm text-[#6f7680] truncate">Brasil - BeGrowth</span>
            <IconChevronDown />
          </div>
        </div>
      </div>

      {/* Right: toggle + divider + avatar */}
      <div className="flex items-center gap-[24px] h-full">
        <ModeToggle />
        <div className="w-px self-stretch bg-border-secondary" />
        <div className="flex items-center gap-[4px]">
          <div className="flex items-center gap-[10px]">
            <div className="relative rounded-full size-[32px] border border-border-secondary overflow-hidden bg-blue-light shrink-0">
              <img
                alt="Rafael Oliveira"
                className="absolute inset-0 size-full object-cover rounded-full"
                src={imgAvatar}
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-semibold text-text-secondary">Rafael Oliveira</span>
              <span className="text-xs text-text-tertiary">rafael@begrowth.com</span>
            </div>
          </div>
          <IconChevronDownSmall />
        </div>
      </div>
    </header>
  );
}
