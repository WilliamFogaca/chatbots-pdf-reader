export function useDismissModal() {
  const dismissCurrentModal = () =>
    (document.querySelector('[data-state="open"]') as HTMLDivElement).click();

  return {
    dismissCurrentModal,
  };
}
