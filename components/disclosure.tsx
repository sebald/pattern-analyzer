export interface DisclosureProps {
  summary: React.ReactNode;
  children: React.ReactNode;
}

export const Disclosure = ({ summary, children }: DisclosureProps) => (
  <details className="group mb-4 rounded-xl border border-secondary-100 px-4 py-2">
    <summary className="flex cursor-pointer select-none list-none items-center justify-between py-2 text-lg font-medium text-secondary-800">
      {summary}
      <div className="text-secondary-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </summary>
    <div className="mt-2 border-t border-secondary-100 py-3">{children}</div>
  </details>
);
