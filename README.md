# Loopla technical test app

## The Task:

1. View a list of upcoming events
2. Filter the list by title
3. Create a new event via a form

## Requirements

### Home page (/)

- ✅ Fetch and display a list of events form `/api/events`
- ✅ Show `title`, `date`, `location`
- ✅ Includ a search bar to filter events by title (client-side)
- ✅ Events must be sorted by the length of the title

### Create Event Page (/create)

- ✅ A for with these inputs
    - title (must contain at least one emoji at the end)
    - description
    - date
    - location (UPPERCASE)
- ✅ CLient-side validation using Typescript
- ✅ Submit a `POST` request to `/api/events`
- ✅ Redirect back to home page after successful creation

### Bonus

- ✅ Add a "success" message after event creation
- ✅ Add event soritn by date
- ✅ Create Event Detail page (`/event/[:id]`)
- ✅ Store event in a simplae JSON file (`data/events.json`) 


### Next steps

#### Code
- [ ] Add ESLint + Prettier for consistent style.
- [ ] Enable strict TypeScript mode for stronger type-safety.

#### Test
- [ ] Unit tests for API endpoints (`/api/events`).
    - [x] POST endpoint: Create new event with validation.
- [ ] Component tests with React Testing Library (validation, search, filter, etc).
- [ ] CI/CD tools to run lint + tests automatically on PRs.

#### UI UX
- [ ] Allow sorting by date, date range or location.
- [ ] Better event create successfully message.


