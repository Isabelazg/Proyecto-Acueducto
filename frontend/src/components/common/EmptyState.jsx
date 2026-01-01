export default function EmptyState({ icon, title, description, colSpan = 4 }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12">
        <div className="flex flex-col items-center gap-2 text-base-content/60">
          {icon ? (
            icon
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          )}
          <span className="font-medium">{title}</span>
          {description && <span className="text-sm">{description}</span>}
        </div>
      </td>
    </tr>
  );
}
