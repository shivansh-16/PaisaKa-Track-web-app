# PaisaKa Track

A modern, user-friendly expense and income tracking web application built with Next.js, React, and Supabase. Track your personal finances, manage group expenses, and gain insights into your spending habits.

## Features

- **Personal Expense Tracking**: Log and categorize your daily expenses and income
- **Group Expense Management**: Create groups and split expenses with friends or family
- **Real-time Analytics**: View spending trends and budget insights
- **Receipt Upload**: Attach receipts to expenses for better record-keeping
- **Voice Input**: Add expenses using voice commands
- **Multi-language Support**: Available in English and Hindi
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: User authentication with Supabase
- **Real-time Updates**: Live updates for group activities and balances

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd paisaka-track-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Follow the detailed setup guide in [`docs/SETUP_SUPABASE.md`](docs/SETUP_SUPABASE.md)
   - Create a new Supabase project
   - Configure authentication and storage
   - Run the provided SQL scripts

4. Configure environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   SUPABASE_PROJECT_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_BUCKET_NAME=paisaka-receipts
   DEFAULT_TIMEZONE=Asia/Kolkata
   SUPPORTED_LANGUAGES=en,hi
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Sign Up/Login**: Create an account or log in with your existing credentials
2. **Dashboard**: View your financial overview, recent transactions, and analytics
3. **Add Expenses**: Use the expense form or voice input to log transactions
4. **Manage Groups**: Create groups for shared expenses and split costs
5. **Track Income**: Record your income sources for complete financial tracking
6. **View Analytics**: Analyze your spending patterns and budget performance

### Key Pages

- `/dashboard`: Main dashboard with financial overview
- `/expenses`: View and manage personal expenses
- `/groups`: Manage expense-sharing groups
- `/income`: Track income sources
- `/profile`: User profile and settings

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Icons**: Lucide React
- **Testing**: Vitest
- **Linting**: ESLint

## Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests with Vitest

## Security

This application follows security best practices:
- Row Level Security (RLS) enforced on all database tables
- Private storage buckets with signed URLs
- Server-side environment variable management
- Input validation on API routes

For detailed security information, see [`docs/SECURITY.md`](docs/SECURITY.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support or questions:
- Check the documentation in the `docs/` folder
- Open an issue in the repository
- Contact the development team

---

Built with ❤️ for better financial management