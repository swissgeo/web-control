export default function useMeta() {
  function setPageTitle(title: string) {
    useHead({
      title: `${title} - Swissgeo control`,
    });
  }

  return {
    setPageTitle,
  };
}
