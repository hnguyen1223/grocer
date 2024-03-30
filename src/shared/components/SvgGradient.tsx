export default function SvgGradient() {
  return (
    <svg width={0} height={0}>
      <linearGradient id="gradient">
        <stop offset={0} stopColor="rgba(238, 119, 82, 0.7)" />
        <stop offset={0.33} stopColor="rgba(231, 60, 126, 0.7)" />
        <stop offset={0.66} stopColor="rgba(35, 166, 213, 0.7)" />
        <stop offset={1} stopColor="rgba(35, 213, 171, 0.7)" />
      </linearGradient>
    </svg>
  );
}
