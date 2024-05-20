interface ResultProps {
  title: string;
  value: string;
}

export default function Result({ title, value }: ResultProps) {
  return (
    <div className="flex items-center gap-x-1">
      {title}
      <span className="font-bold break-all">{value}</span>
    </div>
  );
}
