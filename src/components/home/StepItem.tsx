interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-secondary font-serif text-xl font-bold text-primary shadow-sm">
        {number}
      </div>
      <h3 className="mt-5 font-serif text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-[16rem] text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
