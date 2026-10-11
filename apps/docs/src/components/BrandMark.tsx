export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}brand/logo.svg`} width={32} height={32} alt="" />
    </span>
  );
}
