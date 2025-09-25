import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function OmittedTags({ tags }: { tags: Array<string> }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          {tags.length > 0 && (
            <ul
              className="flex flex-wrap gap-2"
              data-testid="post-tags"
              role="group"
              aria-label="게시물 태그"
            >
              {tags.slice(0, 2).map((tag) => (
                <li key={tag}>
                  <Badge variant="outline" className="text-xs" aria-label={`태그: ${tag}`}>
                    {tag}
                  </Badge>
                </li>
              ))}
              {tags.length > 2 && (
                <li>
                  <Badge
                    variant="secondary"
                    className="bg-muted/50 text-muted-foreground text-xs font-medium"
                    aria-label={`추가 태그 ${tags.length - 2}개`}
                  >
                    +{tags.length - 2}개
                  </Badge>
                </li>
              )}
            </ul>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tags.join(', ')}</p>
      </TooltipContent>
    </Tooltip>
  );
}
