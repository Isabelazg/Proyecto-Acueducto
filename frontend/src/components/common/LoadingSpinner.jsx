export default function LoadingSpinner({ size = 'lg' }) {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className={`loading loading-spinner loading-${size}`}></span>
    </div>
  );
}
