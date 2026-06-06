set -euo pipefail

BASE_URL="https://www.churchofjesuschrist.org/media/music/api"

BOOK_SLUGS=(
  "hymns"
  "hymns-for-home-and-church"
)

for book_slug in "${BOOK_SLUGS[@]}"; do
  identifier="$(
    jq -cn \
      --arg lang "eng" \
      --arg book_slug "$book_slug" \
      '{
        lang: $lang,
        limit: 500,
        offset: 0,
        orderByKey: ["bookSongPosition"],
        bookQueryList: [$book_slug]
      }'
  )"

  curl -sG "$BASE_URL" \
    -H "Accept: application/json" \
    -H "User-Agent: Mozilla/5.0" \
    --data-urlencode "type=songsFilteredList" \
    --data-urlencode "lang=eng" \
    --data-urlencode "identifier=$identifier" \
    --data-urlencode "batchSize=20"
done |
  jq -s '
    [.[].data[]
      | {
          hymnName: .title,
          hymnNumber: .songNumber
        }
    ]
    | sort_by(.hymnNumber | tonumber)
  ' >hymns.json
