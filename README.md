# veneshop!

-First and foremost, make sure you have nodejs and postgresql installed on your operating system. This application was tested 
on a debian 9 operating system with node version 14.15.0 and postgresql version 13.1

-Next, make sure to create an .env file with the following parameters:

DB_USER=yourDatabaseUser

DB_DATABASE=yourDatabase

DB_PASSWORD=yourPassword

DB_HOST=localhost

ROUTE_KEY_TO_LOGIN=key

-Also, create two files for request and error logging. The names of the files 
are "registration-of-request.log" and "error.log".

-Then, create the directory "commerce-photos" in the root directory of the application, and, inside of that directory, create a subdirectory 
called "product-photos"

-Install dependencies (npm install)

-Next, create the database using the "db.js" file found in your archive directory by running the command "node db.js"

-Btw, you need to insert through psql (command line) the credentials of the different administrators of the application. 
It can be 1, 2, 100 admins... you decide.

-Run the application with "node server.js", open the browser and go to localhost:5000
