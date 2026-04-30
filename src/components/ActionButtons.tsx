"use client";

function IconFullscreen() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33334 12.5H1.66667V18.3333H7.50001V16.6667H3.33334V12.5ZM1.66667 7.5H3.33334V3.33333H7.50001V1.66667H1.66667V7.5ZM16.6667 16.6667H12.5V18.3333H18.3333V12.5H16.6667V16.6667ZM12.5 1.66667V3.33333H16.6667V7.5H18.3333V1.66667H12.5Z" fill="#343B44"/>
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.3333C8.15833 13.3333 6.66667 11.8417 6.66667 10C6.66667 8.15833 8.15833 6.66667 10 6.66667C11.8417 6.66667 13.3333 8.15833 13.3333 10C13.3333 11.8417 11.8417 13.3333 10 13.3333ZM16.9167 10.9583L18.0833 12.025C18.3083 12.2333 18.3667 12.5583 18.225 12.8333L17.225 14.575C17.0833 14.85 16.7667 14.9583 16.475 14.8583L15.1167 14.3417C14.8667 14.5167 14.6083 14.6792 14.3333 14.8167L14.125 16.2667C14.075 16.575 13.8167 16.8 13.5 16.8H11.5C11.1833 16.8 10.925 16.575 10.875 16.2667L10.6667 14.8167C10.3917 14.6792 10.1333 14.5167 9.88334 14.3417L8.52501 14.8583C8.23334 14.9583 7.91667 14.85 7.77501 14.575L6.77501 12.8333C6.63334 12.5583 6.69167 12.2333 6.91667 12.025L8.08334 10.9583C8.04167 10.6417 8.33334 10.3333 8.33334 10C8.33334 9.66667 8.04167 9.35833 8.08334 9.04167L6.91667 7.975C6.69167 7.76667 6.63334 7.44167 6.77501 7.16667L7.77501 5.425C7.91667 5.15 8.23334 5.04167 8.52501 5.14167L9.88334 5.65833C10.1333 5.48333 10.3917 5.32083 10.6667 5.18333L10.875 3.73333C10.925 3.425 11.1833 3.2 11.5 3.2H13.5C13.8167 3.2 14.075 3.425 14.125 3.73333L14.3333 5.18333C14.6083 5.32083 14.8667 5.48333 15.1167 5.65833L16.475 5.14167C16.7667 5.04167 17.0833 5.15 17.225 5.425L18.225 7.16667C18.3667 7.44167 18.3083 7.76667 18.0833 7.975L16.9167 9.04167C16.95 9.35833 16.6667 9.66667 16.6667 10C16.6667 10.3333 16.95 10.6417 16.9167 10.9583Z" fill="#343B44"/>
    </svg>
  );
}

function IconSave() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.8333 2.5H4.16667C3.25 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667L15 2.5H15.8333ZM10 15.8333C8.625 15.8333 7.5 14.7083 7.5 13.3333C7.5 11.9583 8.625 10.8333 10 10.8333C11.375 10.8333 12.5 11.9583 12.5 13.3333C12.5 14.7083 11.375 15.8333 10 15.8333ZM12.5 7.5H4.16667V4.16667H12.5V7.5Z" fill="#2724ed"/>
    </svg>
  );
}

function IconPublish() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667ZM8.33334 14.1667V5.83333L14.1667 10L8.33334 14.1667Z" fill="white"/>
    </svg>
  );
}

export default function ActionButtons() {
  return (
    <div className="flex flex-col items-end justify-center bg-bg-white border border-border-secondary rounded-[12px] px-[10px] py-[12px]">
      <div className="flex items-center gap-[8px]">
        {/* Modo foco */}
        <button className="flex items-center gap-[4px] bg-surface-primary border border-border-secondary rounded-[8px] px-[12px] py-[8px] hover:bg-gray-50 transition-colors">
          <IconFullscreen />
          <span className="text-sm font-semibold text-text-secondary whitespace-nowrap">Modo foco</span>
        </button>

        <div className="w-px h-[20px] bg-border-secondary" />

        {/* Settings */}
        <button className="flex items-center justify-center bg-surface-primary border border-border-primary rounded-[8px] p-[8px] hover:bg-gray-50 transition-colors">
          <IconSettings />
        </button>

        {/* Salvar */}
        <button className="flex items-center gap-[4px] bg-brand-light border border-brand-border rounded-[8px] px-[12px] py-[8px] hover:opacity-90 transition-opacity">
          <IconSave />
          <span className="text-sm font-semibold text-brand whitespace-nowrap">Salvar</span>
        </button>

        {/* Salvar e publicar */}
        <button className="flex items-center gap-[4px] bg-brand rounded-[8px] px-[12px] py-[8px] hover:opacity-90 transition-opacity">
          <IconPublish />
          <span className="text-sm font-semibold text-text-white whitespace-nowrap">Salvar e publicar</span>
        </button>
      </div>
    </div>
  );
}
