import Button from "@/components/ui/Button";

export default function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center">
      <Button variant="ghost" size="sm" onClick={onClick} aria-label="Swap units">
        <span aria-hidden="true">↕</span> Swap
      </Button>
    </div>
  );
}
