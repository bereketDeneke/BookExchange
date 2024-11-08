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
 >> Front End:
  [Login implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/login.js)  
  [Registration implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/register.js)  
  [Logout & page redirection implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/utils/helper.js)  
  [Profile Component Header implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/components/header.js)  
  [Global standard design customization](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/styles/global.css)  


 >> Back End: 
  [Login implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/login.js)  
  [Registration implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/register.js)  
  [Lgout implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-bereketDeneke/blob/master/pages/api/auth/logout.js)  


### References
- **Server setup**: https://cims.nyu.edu/webapps/content/systems/resources/computeservers/linserv
- **MongoDB Account Creation**: [Professor Joseph John Versoza's zoom video](https://nyu.zoom.us/rec/play/kYNbY1VgzlMrn6Ro7SnsH-viqAo6UmvoVSXMTNZklV5_8LTLifUa_6U7k_eRHSDM5MJ9coBL1OFuok_G.r0SDqWVS5vIkYB3x?canPlayFromShare=true&from=share_recording_detail&startTime=1698350163000&componentName=rec-play&originRequestUrl=https%3A%2F%2Fnyu.zoom.us%2Frec%2Fshare%2FHB-Ft5eCsIQXpUEzmyJDLu5B1cSLHwmZ2BMLdXnhuvdOUZmjyaPNKT6kYrop4vqL.7Ha58YP9CYkCKz5r%3FstartTime%3D1698350163000)
- **User Input Validation**: Schema declaration and validation library [zod](https://zod.dev/).
- **Password Hashing**: Follows best practices from [bcrypt Documentation](https://www.npmjs.com/package/bcrypt).
- **Session Handling**: Adapted from a session management tutorial on [Session Management Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
