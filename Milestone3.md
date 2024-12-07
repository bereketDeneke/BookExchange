## Milestone 02

### Repository Link

[https://github.com/bereketDeneke/BookExchange](https://github.com/bereketDeneke/BookExchange)

### Special Instructions for Using Form and/or Login

- **Form Validation**: All fields are required for both registration and login.
- **Password Requirements**: Password must contain at least:
  - 8 characters
  - One uppercase letter
  - One lowercase letter
  - One special character
  - One digit
- **Unique Email**: Each email address must be unique for registration. However, usernames do not have to be unique.
- **Remember Me**: 
  - If the "Remember Me" option is checked, the session will stay active for 7 days.
  - If left unchecked, the session will expire in 1 hour.

### URL for Deployed Site
[http://linserv1.cims.nyu.edu:23516/](http://linserv1.cims.nyu.edu:23516/)

### URL for Form
> Registration Form
[http://linserv1.cims.nyu.edu:23516/register](http://linserv1.cims.nyu.edu:23516/register)

> Login Form
[http://linserv1.cims.nyu.edu:23516/login](http://linserv1.cims.nyu.edu:23516/login)

### URL for Form Result
Once the user logs in, they should be redirected to a dashboard displaying a list of sample books.
[http://linserv1.cims.nyu.edu:23516/](http://linserv1.cims.nyu.edu:23516/)  

### URL to GitHub that Shows Code for Research Topics
- **Link to Research Topic Code Implementation**:  
 >> Frontend:
  [Login implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/login.js)  
  [Registration implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/register.js)  
  [Logout & page redirection implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/utils/helper.js)  
  [Profile Component Header implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/components/header.js)  
  [Global standard design customization](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/styles/global.scss)  


 >> Backend: 
  [Login implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/login.js)  
  [Registration implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/register.js)  
  [Lgout implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/logout.js)  


 >> Authorization Form API Test: 
Implementation for testing authorization functionality using Chai and Supertest
[auth.test.mjs - Authorization Form API Test](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/tests/auth.test.mjs)
To test the API, create a `.env` file with the following key-value pairs:
- `SERVER_URL` - http://linserv1.cims.nyu.edu
- `PORT` - 23516


>> Automated Code Quality Configuration: [ESLint, Prettier, and Husky configuration](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/.eslintrc.js) </br>
  - Pre-Commit Hook for Automated Linting: [Husky pre-commit hook](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/.husky/pre-commit)


## Milestone 3
- **Instruction**: You must log in before accessing the following URL.  
  > If you are not logged in, the URL will redirect you to the login page. After logging in, click on the profile icon located in the header section of the platform. If no profile picture is set, the icon will display a default avatar. Clicking on the profile icon will take you to the profile page, where you can upload a profile picture and update your full name.  

  > **Profile Update Form (using Ajax):**  
  [http://linserv1.cims.nyu.edu:23516/profile](http://linserv1.cims.nyu.edu:23516/profile)

  > Once your profile information is updated, the changes will persist and be reflected every time you log in using the same credentials.  

  > Under the profile section, you will find a "Your Book Collections" section, which lists books you have chosen to sell, rent, or give away for free. Currently, these books are generated from dummy data and will later be replaced with actual data when you upload a new book to share publicly.  

  > Additionally, a streak counter tracks your activity. Your streak increases as you share more books, with different point contributions based on whether you rent out, give away, or sell books.  

---

### URL to GitHub that Shows Code for Research Topics
- **Link to Research Topic Code Implementation**:  
>> Frontend: [Profile Page Implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/profile.js) </br>
[Book List Search Integration](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/bookList.js)</br>

>> Backend: [get profile information](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/profile/getProfile.js) </br>
[update profile information](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/profile/updateProfile.js) </br>
[Profile page design customization](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/styles/Profile.module.css)

### References
- **User Input Validation**: Schema declaration and validation library, [zod](https://zod.dev/).  
- **Session Handling**: Adapted from the session management tutorial in [OWASP Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).  
- **API Testing**: [supertest](https://www.npmjs.com/package/supertest).  
- **User Input Sanitization**: [validator](https://www.npmjs.com/package/validator).  