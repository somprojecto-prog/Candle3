import { CODE } from "@/lib/constants";
import CodeComment from "@/components/ui/CodeComment";

export default function HeroLabel() {
  return (
    <div data-hero-comment>
      <CodeComment>{CODE.focus}</CodeComment>
    </div>
  );
}