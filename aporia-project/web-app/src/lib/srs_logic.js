// SM-2 Spaced Repetition Logic
function calculateNextReview(quality, ease, interval) {
  // quality: 0-5 (5: easy, 3: effort, 0: forgot)
  let nextEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEase < 1.3) nextEase = 1.3;

  let nextInterval;
  if (quality < 3) {
    nextInterval = 1;
  } else {
    if (interval === 0) nextInterval = 1;
    else if (interval === 1) nextInterval = 6;
    else nextInterval = Math.round(interval * nextEase);
  }

  return {
    next_ease: nextEase,
    next_interval: nextInterval,
    next_review_date: Date.now() + nextInterval * 24 * 60 * 60 * 1000
  };
}