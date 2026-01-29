export default function useMeta() {
  function setPageTitle(title: string) {
    useHead({
      title: `${title} - SWISSGEO control`,
    });
  }

  return {
    setPageTitle,
  };
}
