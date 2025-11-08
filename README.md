# LegalSnap - AI Legal Assistant

LegalSnap is a Next.js application that provides AI-powered legal consultation services. Users can consult with specialized AI lawyers, generate detailed legal reports, and export their consultation summaries.

## Features

- **AI Legal Consultation**: Chat with specialized AI lawyers for different legal domains
- **Legal Report Generation**: Automatic generation of detailed legal reports with insights
- **Export Functionality**: Download consultation reports as JSON files
- **User Authentication**: Secure user management with Clerk
- **Session Management**: Track and manage consultation sessions
- **Responsive UI**: Modern, mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI via OpenRouter
- **Voice**: VAPI integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- OpenRouter API key for AI services
- VAPI account for voice features

### Environment Variables

**⚠️ IMPORTANT: You must create a `.env.local` file before running the application!**

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# OpenAI Configuration (using OpenRouter)
OPEN_ROUTER_API_KEY=your_openrouter_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# VAPI Configuration
NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID=your_vapi_assistant_id
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

#### How to Get These Values:

1. **DATABASE_URL**: 
   - Use a PostgreSQL database (local or cloud)
   - Format: `postgresql://username:password@host:port/database`
   - Free options: Neon, Supabase, Railway, or local PostgreSQL

2. **OPEN_ROUTER_API_KEY**:
   - Sign up at [OpenRouter](https://openrouter.ai/)
   - Get your API key from the dashboard
   - This provides access to various AI models including GPT-4

3. **Clerk Keys**:
   - Sign up at [Clerk](https://dashboard.clerk.com/)
   - Create a new application
   - Copy the publishable key and secret key

4. **VAPI Keys** (Optional for voice features):
   - Sign up at [VAPI](https://vapi.ai/)
   - Create a voice assistant
   - Get your API key and assistant ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd legalsnap
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Run the migration script
psql -d your_database -f migrations/001_update_schema.sql
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment on Vercel

### 1. Prepare Environment Variables

In your Vercel dashboard, add the following environment variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `OPEN_ROUTER_API_KEY`: Your OpenRouter API key
- `CLERK_SECRET_KEY`: Your Clerk secret key

### 2. Database Setup

Ensure your PostgreSQL database is accessible from Vercel and run the migration script:

```sql
-- Run migrations/001_update_schema.sql on your database
```

### 3. Deploy

The project is configured for Vercel deployment with `vercel.json`. Simply connect your GitHub repository to Vercel and deploy.

### 4. Post-Deployment

After deployment, verify:
- [ ] User authentication works
- [ ] Database connections are established
- [ ] AI report generation functions
- [ ] Export functionality works
- [ ] All API routes respond correctly

## API Routes

- `POST /api/users` - Create/get user
- `POST /api/session-chat` - Create new session
- `GET /api/session-chat?sessionId=all` - Get all sessions
- `GET /api/session-chat?sessionId=<id>` - Get specific session
- `POST /api/legal-report` - Generate legal report
- `POST /api/suggest-lawyers` - Get lawyer recommendations

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: User's email (unique)
- `credits`: Available consultation credits

### Session Chat Table
- `id`: Primary key
- `sessionId`: Unique session identifier
- `notes`: Session notes
- `selectedLawyer`: Lawyer information (JSON)
- `conversation`: Chat messages (JSON)
- `report`: Generated legal report (JSON)
- `createdBy`: User email (foreign key)
- `createdAt`: Session creation timestamp
- `updatedAt`: Last update timestamp

## Troubleshooting

### Common Issues

1. **500 Error on Session History**
   - **Cause**: Missing environment variables (especially `DATABASE_URL`)
   - **Solution**: Create `.env.local` file with all required variables
   - **Check**: Look for error messages in console about missing environment variables

2. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from your network
   - Check if migration script was run
   - Test connection with: `curl http://localhost:3000/api/test-db`

3. **AI Report Generation Fails**
   - Verify `OPEN_ROUTER_API_KEY` is valid
   - Check OpenRouter API limits
   - Review error logs in browser console

4. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check Clerk dashboard for configuration
   - Ensure redirect URLs are properly set

5. **Export Functionality**
   - Check browser console for JavaScript errors
   - Verify file download permissions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
