# Florida Project Tracker

A web-based application to track decisions and action items for the JoJo Florida TnT Project.

## Quick Start

Simply double-click the `launch.sh` file in the root directory to start the application!

The script will:
1. Install all dependencies (if needed)
2. Start the backend server (port 3001)
3. Start the frontend server (port 3000)
4. Open your browser automatically to http://localhost:3000

Press `Ctrl+C` in the terminal to stop all servers.

## Manual Setup (if needed)

### Backend Setup

```bash
cd code/backend
npm install
npm run seed        # Populate database with data from decisions-and-actions.md
npm start           # Start the server on port 3001
```

### Frontend Setup

```bash
cd code/frontend
npm install
npm start           # Start the dev server on port 3000
```

## Features

### Dashboard
- Overview statistics for decisions and actions
- Pending decisions requiring resolution
- Critical path action items
- Upcoming action items

### Decisions
- View all decisions (decided and pending)
- Filter by status (all, pending, decided)
- Create new decisions
- Edit existing decisions
- Delete decisions
- Track decision options, rationale, owner, and deadlines

### Actions
- View all action items
- Filter by status (all, pending, in_progress, completed, critical path)
- Create new actions
- Edit existing actions
- Quick status toggle (click status badge to cycle through states)
- Delete actions
- Track due dates, owners, dependencies, and notes
- Mark critical path items

## Tech Stack

- **Backend:** Node.js + Express + SQLite
- **Frontend:** React
- **Database:** SQLite (file-based, no server needed)

## File Structure

```
Florida/
├── launch.sh                          # One-click launcher
├── decisions-and-actions.md          # Original markdown file
├── README.md                         # This file
└── code/
    ├── backend/
    │   ├── server.js                 # Express server
    │   ├── database.js               # Database schema
    │   ├── routes.js                 # API endpoints
    │   ├── seed-data.js              # Initial data from markdown
    │   ├── florida.sqlite            # SQLite database (created on first run)
    │   └── package.json
    └── frontend/
        ├── src/
        │   ├── App.js                # Main app component
        │   ├── components/
        │   │   ├── Dashboard.js      # Dashboard view
        │   │   ├── DecisionsList.js  # Decisions management
        │   │   └── ActionsList.js    # Actions management
        │   └── ...
        └── package.json
```

## API Endpoints

### Decisions
- `GET /api/decisions` - Get all decisions
- `GET /api/decisions/:id` - Get single decision
- `POST /api/decisions` - Create decision
- `PUT /api/decisions/:id` - Update decision
- `DELETE /api/decisions/:id` - Delete decision

### Actions
- `GET /api/actions` - Get all actions
- `GET /api/actions/:id` - Get single action
- `POST /api/actions` - Create action
- `PUT /api/actions/:id` - Update action
- `DELETE /api/actions/:id` - Delete action

### Stats
- `GET /api/stats` - Get overview statistics

## Data Management

The database is automatically populated with data from `decisions-and-actions.md` when you first run the seed script.

To reset the database to original data:
```bash
cd code/backend
npm run seed
```

All changes are saved to the SQLite database file (`code/backend/florida.sqlite`). The original markdown file is not modified.

## Development

- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:3000
- Frontend proxies API requests to backend automatically

## Tips

1. **Quick Status Updates:** In the Actions view, click on the status badge to quickly cycle through: pending → in_progress → completed
2. **Filtering:** Use the filter buttons to focus on specific categories of decisions or actions
3. **Critical Path:** Actions marked as "on critical path" are highlighted with a red border
4. **Dependencies:** The dependencies field accepts comma-separated values to track relationships between items

## Troubleshooting

**Port already in use:**
If you see an error about ports 3000 or 3001 being in use, stop the conflicting process or edit the port numbers in:
- Backend: `code/backend/server.js` (line with `PORT`)
- Frontend: Add `PORT=3002` to `code/frontend/.env` file

**Dependencies not installing:**
Make sure you have Node.js installed (version 14 or higher). Check with:
```bash
node --version
npm --version
```

**Can't execute launch.sh:**
Make it executable:
```bash
chmod +x launch.sh
```

## Future Enhancements

Potential features to add:
- Export to PDF or markdown
- Email notifications for upcoming deadlines
- Timeline/Gantt chart visualization
- File attachments for decisions/actions
- Search functionality
- Mobile-responsive design improvements
