/** Play routes: no platform chrome — pure fullscreen game */
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden">
      {children}
    </div>
  );
}
