# World Cup Excitement Score

The 2026 FIFA World Cup will feature 48 teams and 104 matches. This project ranks every match using a custom excitement model based on attacking output, defensive openness, star power, Elo ratings, match importance, and narrative factors, helping fans identify the most watchable games of the tournament.

## Live Demo
https://jsonrbrt.github.io/wc-excitement-score/

## Screenshots

### Netherlands v Japan excitement score
![Netherlands v Japan](./screenshots/netherlands_v_japan.png)

## How It Works

The excitement score is calculated using:

- Attacking output (goals scored per match)
- Defensive openness (goals conceded per match)
- Star power
- Elo rating difference
- Match importance
- Narrative / rivalry score

The resulting score is normalized to a 0-100 scale.

## Watch Tiers

- Must Watch (65+)
- Strong Watch (60-64)
- Background Watch (45-59)
- Skippable (<45)

## Features

- **Top 10 Group Stage Matches**: If you just want to see the best games, these are the ones worth checking out!
- **Select any match**: Pick any match from the list to see kickoff time, where to watch, and the excitement score.
- **"Why Watch?" panel**: A short summary detailing why this particular game is worth watching.
- **Star Players**: Familiarize yourself with the stars of every country competing in this tournament.
- **Score Breakdown**: How each metric contributed to the overall Excitement Score.

## Data Source

- **Fixtures**: Wikipedia
- **Elo Ratings and Ranks**: World Football Elo Ratings
- **Team stats**: SofaScore
- **Squad values**: Transfermarkt

## Tech Stack
- HTML
- CSS
- Vanilla JavaScript
- Python
- Pandas
- ScraperFC
- SofaScore API

## Future Improvements

- Fan voting system
- Actual excitement score based on match events
- Automatic fixture and results updates
- Match recommendation engine

## License

[MIT](https://choosealicense.com/licenses/mit/)