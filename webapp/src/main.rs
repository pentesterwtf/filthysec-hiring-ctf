#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate base64;

use rocket::request::{Form, FormDataError, FormError};
use rocket::response::Redirect;
use rocket_contrib::serve::StaticFiles;
use rocket_contrib::templates::Template;
use std::collections::HashMap;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;

use rocket::Request;

#[get("/newclient/<email>")]
fn newclient_create(email: String) -> Template {
    let mut context = HashMap::new();
    context.insert("email", &email);
    Template::render("newclient-createlogin", &context)
}

#[get("/goto/<url>")]
fn goto(url: String) -> Redirect {
    return Redirect::found(format!("/{}", url));
}

// Used for createaccount page
#[derive(Debug, FromForm)]
struct FormInputResume {
    email_address: String,
    resume: String,
    resume_bytes: String,
}

#[post("/joinus", data = "<sink>")]
fn submitresume(sink: Result<Form<FormInputResume>, FormError<'_>>) -> Template {
    match sink {
        Ok(form) => {
            // Values seem ok - Let's do our logic bits

            let mut context = HashMap::new();
            context.insert("email", form.email_address.to_string());
            context.insert("filename", form.resume.to_string());
            let x = format!(".//uploads//{}", form.resume);
            let path = Path::new(&x);
            let display = path.display();
            context.insert("debug", format!("{}", display));

            let bytes = base64::decode(form.resume_bytes.to_string()).unwrap();

            let mut file = match File::create(&path) {
                Err(why) => panic!("couldn't create {}: {}", display, why),
                Ok(file) => file,
            };

            match file.write_all(bytes.as_slice()) {
                Err(why) => panic!("couldn't write to {}: {}", display, why),
                Ok(_) => println!("successfully wrote to {}", display),
            }

            Template::render("joinus-confirmed", &context)
        }
        Err(FormDataError::Io(_)) => {
            let mut context = HashMap::new();
            context.insert("message", "Error in handling input, please try again");
            Template::render("joinus", &context)
        }
        Err(FormDataError::Malformed(f)) | Err(FormDataError::Parse(_, f)) => {
            let mut context = HashMap::new();
            println!("{}", f);
            context.insert("message", "Error in handling input, please try again");
            Template::render("joinus", &context)
        }
    }
}

// Used for createaccount page
#[derive(Debug, FromForm)]
struct FormInputNewAccount {
    email_address: String,
    password: String,
}

#[post("/createaccount", data = "<sink>")]
fn createaccount(sink: Result<Form<FormInputNewAccount>, FormError<'_>>) -> Template {
    match sink {
        Ok(form) => {
            // Values seem ok - Let's do our logic bits
            // We don't really want them to go down this path
            // So we'll give them a hint about something else
            // I.e. Check out the preregistration page's API calls
            let mut context = HashMap::new();
            context.insert("email", "Account submitted. (Hint: Try somewhere else :) )");
            Template::render("newclient-createlogin", &context)
        }
        Err(FormDataError::Io(_)) => {
            let mut context = HashMap::new();
            context.insert("message", "Error in handling input, please try again");
            Template::render("newclient-createlogin", &context)
        }
        Err(FormDataError::Malformed(f)) | Err(FormDataError::Parse(_, f)) => {
            let mut context = HashMap::new();
            println!("{}", f);
            context.insert("message", "Error in handling input, please try again");
            Template::render("newclient-createlogin", &context)
        }
    }
}

// Used for our newclient page
#[derive(Debug, FromForm)]
struct FormInputNewclient {
    budget_size: String,
    email_address: String,
    budget_spiel: String,
}

#[post("/newclient-confirm", data = "<sink>")]
fn newclient_confirm(sink: Result<Form<FormInputNewclient>, FormError<'_>>) -> Template {
    match sink {
        Ok(form) => {
            let mut context = HashMap::new();
            context.insert("email", form.email_address.to_string());
            context.insert("why", form.budget_spiel.to_string());
            context.insert("budget", form.budget_size.to_string());
            Template::render("newclient-confirm", &context)
        }
        Err(FormDataError::Io(_)) => {
            let mut context = HashMap::new();
            context.insert("message", "Error in handling input, please try again");
            Template::render("newclient-landing", &context)
        }
        Err(FormDataError::Malformed(f)) | Err(FormDataError::Parse(_, f)) => {
            let mut context = HashMap::new();
            println!("{}", f);
            context.insert("message", "Error in handling input, please try again");
            Template::render("newclient-landing", &context)
        }
    }
}

// Everything below this point is basically boilerplate and very, very boring

fn main() {
    rocket().launch();
}

fn rocket() -> rocket::Rocket {
    rocket::ignite()
        .mount(
            "/",
            routes![
                index,
                testimonials,
                newclient_confirm,
                whyus,
                newclient,
                newclient_create,
                createaccount,
                goto,
                joinus,
                submitresume
            ],
        )
        .mount(
            "/static",
            StaticFiles::from(concat!(env!("CARGO_MANIFEST_DIR"), "/static")),
        )
        .attach(Template::fairing())
        .register(catchers![not_found])
}

// Static guff goes here

// Our exception handler for 404's
#[catch(404)]
fn not_found(req: &Request<'_>) -> Template {
    let mut map = HashMap::new();
    map.insert("path", req.uri().path());

    let ip = req.client_ip().unwrap().to_string();
    map.insert("ip", &ip);

    // Get user agent
    let ua = req.headers().get_one("User-Agent").unwrap_or("Not Set");
    map.insert("useragent", ua);

    // Get host
    let host = req.headers().get_one("Host").unwrap_or("Not Set");
    map.insert("host", host);

    // Get cookie
    let host = req.headers().get_one("Cookie").unwrap_or("Not Set");
    map.insert("cookie", host);

    Template::render("error/404", &map)
}

// The careers page
// I.e. Content copied from other websites
#[get("/joinus")]
fn joinus() -> Template {
    let mut context = HashMap::new();
    context.insert("", "");
    Template::render("joinus", &context)
}

// The testimonials page
// I.e "How good we are at Cyber"
#[get("/testimonials")]
fn testimonials() -> Template {
    let mut context = HashMap::new();
    context.insert("", "");
    Template::render("testimonials", &context)
}

// The Why Us page
// i.e. Why you should use our cyberGizmos
#[get("/whyus")]
fn whyus() -> Template {
    let mut context = HashMap::new();
    context.insert("", "");
    Template::render("whyus", &context)
}

// Landing page for new clients
// i.e. A bullshit form that gets spammed immediately
#[get("/newclient")]
fn newclient() -> Template {
    let mut context = HashMap::new();
    context.insert("", "");
    Template::render("newclient-landing", &context)
}

// The main page
#[get("/")]
fn index() -> Template {
    let mut context = HashMap::new();
    context.insert("", "");
    Template::render("index", &context)
}
