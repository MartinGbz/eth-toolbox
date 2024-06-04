import { Badge } from "./ui/badge";

interface ResultProps {
  title: string;
  value: string;
  estimation?: boolean;
}

export default function Result({ title, value, estimation }: ResultProps) {
  return (
    <div className="flex items-center gap-x-1">
      {title}
      <span className="font-bold break-all">{value}</span>
      {estimation && (
        <Badge variant="outline" className="ml-2">
          estimation
        </Badge>
      )}
    </div>
  );
}
