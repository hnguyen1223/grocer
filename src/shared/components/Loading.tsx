export default function Loading({ loading }: { loading: boolean }) {
  return (
    loading && (
      <div
        className="gradient"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradient 1s ease infinite",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "inherit",
        }}
      ></div>
    )
  );
}
