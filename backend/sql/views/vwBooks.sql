CREATE OR REPLACE VIEW vwBooks AS
SELECT
    b.id,
    b.created_at,
    b.updated_at,
    b.title,
    s.name as series_name,
    s.id as series_id,
    STRING_AGG(DISTINCT a.name, ', ' ORDER BY a.name) as authors,
    b.rating,
    (b.rating - 5) as rating_5_star,
    b.owned,
    b.read_soon,
    b.notes,
    COUNT(DISTINCT rl.id) as times_read,
    COUNT(DISTINCT rl.id) > 0 as is_read,
    STRING_AGG(
        DISTINCT TO_CHAR(rl.date_finished, 'DD/MM/YY'),
        ', '
        ORDER BY TO_CHAR(rl.date_finished, 'DD/MM/YY')
    ) as dates_read,
    MAX(rl.date_finished) as last_read_date,
    MIN(rl.date_finished) as first_read_date
FROM books b
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
LEFT JOIN series s ON b.series_id = s.id
LEFT JOIN read_logs rl ON b.id = rl.book_id
WHERE b.deleted_at IS NULL
GROUP BY b.id, b.created_at, b.updated_at, b.title, s.name, s.id, b.rating, b.owned, b.read_soon, b.notes;
