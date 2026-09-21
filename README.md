Waygood Study Abroad Platform - Backend Assignment

This repository contains the backend implementation for the MERN Stack Backend Developer Intern assignment at Waygood. The platform helps students discover universities, compare programs, plan budgets, track applications, and receive AI-assisted study planning.

🚀 Core Features Implemented

1. Secure Authentication & Authorization:

Complete user registration (POST /api/auth/register), login (POST /api/auth/login), and protected profile retrieval (GET /api/auth/me). 
  Stateless authentication implemented using JSON Web Tokens (JWT).   Secure password hashing using bcryptjs with proper salt rounds.   Role-based access control supporting student and counselor roles. 

2. Advanced University & Program Discovery:Advanced filtering endpoints (GET /api/universities, GET /api/programs) supporting country, intake, degree level, budget, scholarship availability, and text search.  
 Clean, consistent, and frontend-friendly pagination metadata and sorting options.   
  
3. Smart Recommendation Engine:Built using the MongoDB Aggregation Pipeline (GET /api/recommendations/:studentId).  
 Matches programs based on the student's preferred country, budget, field of interest, intake, and IELTS score preferences, returning top matches along with explanatory match reasons. 

4. Robust Application Workflow System:
  
Complete application lifecycle management (POST /api/applications, PATCH /api/applications/:id/status).  
 Prevention of duplicate applications for the same student, program, and intake using unique compound indexes.  
 Strict validation of status transitions (e.g., Applied → Reviewed → Accepted/Rejected) with automatic timeline/status history tracking. 

5.   Performance, Caching & Indexing:
 Integrated caching mechanisms using Node-Cache for frequently accessed endpoints (popular universities and dashboard summaries). 
 Documented and implemented strategic MongoDB indexes to optimize high-traffic queries. 

6.  Bonus: AI-Based Study Planning:
Added an AI endpoint (GET /api/ai/study-plan) to generate personalized study timelines, preparation milestones, and recommendations for students.   

🛠️ Tech Stack
Runtime & Framework: Node.js, Express.js   
Database & ODM: MongoDB, Mongoose (with Aggregation Framework)  
Authentication: JSON Web Tokens (JWT), bcryptjs   
Caching: Node-Cache   

📁 Starter Project Structure

.
|-- backend
|   |-- src
|   |   |-- config       # Database and environment configurations
|   |   |-- controllers  # Request handlers (Auth, Programs, Applications, AI)
|   |   |-- data         # Seed datasets
|   |   |-- middleware   # Auth protection, error handling, validation
|   |   |-- models       # Mongoose schemas (Student, Program, Application, University)
|   |   |-- routes       # API route definitions
|   |   |-- scripts      # Database seeding scripts
|   |   |-- services     # Business logic & recommendation algorithms
|   |   `-- utils        # Async handlers, custom HTTP errors
|-- frontend             # Minimal React dashboard shell
`-- docs                 # Assignment brief and reference documents

⚙️ Setup & Installation Instructions

1. Backend Setup

cd backend
npm install

2. Environment Configuration

PORT=5000
MONGO_URI=mongodb://localhost:27017/waygood-assignment
JWT_SECRET=your_super_secret_jwt_key_here

3. Seed Sample Data

npm run seed

4. Start the Server

npm run dev

5. Frontend Setup (Optional)

cd frontend
npm install
npm run dev

🏗️ Architecture Decisions & Design Choices

1. Stateless Authentication (JWT & Bcrypt)

JSON Web Tokens (JWT) are used for stateless authentication so that the server does not need to store session states in memory, ensuring seamless scalability.   bcryptjs is utilized to hash passwords securely with proper salt rounds before storing them in the database.   

2. Database Indexing & PerformanceProgram Collection: 

Indexes are created on country, fieldOfStudy, and tuitionFee to ensure filtering and sorting queries execute in milliseconds.   Application Collection: A unique compound index ({ student: 1, program: 1, intake: 1 }) is enforced at the database level to strictly block duplicate applications for the same intake.

3. Recommendation Engine Pipeline

MongoDB’s native Aggregation Framework ($match, $addFields, $sort) is leveraged to evaluate student profile preferences directly at the database level, calculating match scores efficiently for fast suggestions.

4. Caching Strategy

Node-Cache is integrated into high-traffic routes (such as popular universities and dashboard analytics) to minimize repetitive database reads and significantly improve API response times.