type Props = { page: number; total: number; limit: number; onPage: (p: number) => void }
export default function Pagination({ page, total, limit, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / limit))
  return (
    <div className="pagination">
      <button className="button secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
      <div>{page} / {pages}</div>
      <button className="button secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  )
}
