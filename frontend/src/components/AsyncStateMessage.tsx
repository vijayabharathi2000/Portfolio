export function AsyncStateMessage({ text }: { text: string }) {
  return (
    <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
      {text}
    </p>
  )
}
