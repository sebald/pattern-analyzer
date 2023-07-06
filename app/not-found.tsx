// Metadata
// ---------------
export const metadata = {
  title: '404 - Page not founds',
};

// Page
// ---------------
export default function NotFound() {
  return (
    <div className="grid flex-1 place-items-center">
      <div className="flex items-start gap-4">
        <div className="text-9xl font-extrabold text-rose-700">404</div>
        <div className="pt-2">
          <h2 className="text-4xl font-extrabold uppercase">Not Found</h2>
          <p className="text-secondary-500">
            Could not find requested resource
          </p>
        </div>
      </div>
    </div>
  );
}
