function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function fetchListening() {
    const el = document.getElementById('status-listening-value');
    try {
        const res = await fetch('/api/listening/last');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.expired || !data.item) { el.textContent = 'nothing recent'; return; }
        const track = data.item.trackName || '—';
        const artist = (data.item.artists || []).map(a => a.artistName).join(', ');
        el.innerHTML = `<a href="https://teal.fm" target="_blank" rel="noopener" class="accent">${esc(track)}</a>${artist ? ` by ${esc(artist)}` : ''}`;
    } catch { el.textContent = '—'; }
}

async function fetchLastRead() {
    const el = document.getElementById('status-reading-value');
    try {
        const res = await fetch('/api/books/last-read');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!data.book) { el.textContent = '—'; return; }
        const title = data.book.title || '—';
        const author = (data.book.authors || []).map(a => a.name).join(', ');
        el.textContent = `${title}${author ? ` by ${author}` : ''}`;
    } catch { el.textContent = '—'; }
}

async function fetchLastCommit() {
    const el = document.getElementById('status-commit-value');
    try {
        const res = await fetch('https://api.github.com/users/michaelevy/events/public');
        if (!res.ok) throw new Error();
        const events = await res.json();
        const push = events.find(e => e.type === 'PushEvent');
        if (!push) { el.textContent = '—'; return; }
        const repoName = push.repo.name.replace('michaelevy/', '');
        const repoUrl = `https://github.com/${push.repo.name}`;
        const commits = push.payload.commits || [];
        const lastCommit = commits.at(-1);
        let msg = lastCommit?.message?.split('\n')[0];
        if (!msg && push.payload.head) {
            const commitRes = await fetch(`https://api.github.com/repos/${push.repo.name}/commits/${push.payload.head}`);
            if (commitRes.ok) {
                const commitData = await commitRes.json();
                msg = commitData.commit?.message?.split('\n')[0];
            }
        }
        el.innerHTML = `<a href="${esc(repoUrl)}" target="_blank" rel="noopener" class="accent">${esc(repoName)}</a>: ${esc(msg || '—')}`;
    } catch { el.textContent = '—'; }
}

async function fetchLastPost() {
    const el = document.getElementById('status-post-value');
    try {
        const res = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=michaelevy.com&limit=10&filter=posts_no_replies');
        if (!res.ok) throw new Error();
        const data = await res.json();
        const feedItem = (data.feed || []).find(item => !item.reason);
        if (!feedItem) { el.textContent = '—'; return; }
        const post = feedItem.post;
        const text = post?.record?.text || '—';
        const rkey = post?.uri?.split('/').at(-1);
        const url = `https://bsky.app/profile/michaelevy.com/post/${rkey}`;
        el.innerHTML = `<a href="${esc(url)}" target="_blank" rel="noopener" class="accent">${esc(text)}</a>`;
    } catch { el.textContent = '—'; }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchListening();
    fetchLastRead();
    fetchLastCommit();
    fetchLastPost();
});
