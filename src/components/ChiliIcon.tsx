/** Minimalist green chili SVG to replace the dot on "i" */
const ChiliIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Stem */}
    <path
      d="M12 2C12 2 11 5 12 6C13 5 12 2 12 2Z"
      fill="hsl(142, 72%, 23%)"
    />
    {/* Chili body */}
    <path
      d="M8 7C8 7 6 12 7 16C8 20 11 22 12 22C13 22 16 20 17 16C18 12 16 7 16 7C14 6 10 6 8 7Z"
      fill="hsl(142, 71%, 45%)"
    />
    {/* Highlight */}
    <path
      d="M10 9C10 9 9 13 10 16C10.5 14 10.5 11 10 9Z"
      fill="hsl(142, 77%, 89%)"
      opacity="0.6"
    />
  </svg>
);

export default ChiliIcon;
