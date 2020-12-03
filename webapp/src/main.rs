#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::request::{Form, FormDataError, FormError};
use rocket::response::Redirect;
use rocket_contrib::serve::StaticFiles;
use rocket_contrib::templates::Template;
use std::collections::HashMap;

use rocket::Request;

/*
#[derive(serde::Serialize)]
struct TemplateContext {
    name: String,
    items: Vec<&'static str>,
}
*/

#[get("/hello/<name>")]
fn get(name: String) -> Template {
    let mut context = HashMap::new();
    context.insert("name", &name);
    Template::render("test", &context)
}

#[get("/goto/<url>")]
fn goto(url: String) -> Redirect {
    return Redirect::found(format!("/{}", url));
}

// Used for our newclient page
#[derive(Debug, FromForm)]
struct FormInput {
    budget_size: String,
    email_address: String,
    budget_spiel: String,
}

#[post("/newclient-confirm", data = "<sink>")]
fn newclient_confirm(sink: Result<Form<FormInput>, FormError<'_>>) -> Template {
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
                get,
                testimonials,
                newclient_confirm,
                whyus,
                newclient,
                goto
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
