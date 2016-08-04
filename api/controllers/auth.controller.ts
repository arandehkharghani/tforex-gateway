
export async function oauthDialogeGet (req, res, next) {
  // oauth2.authorization(req, res, next);
  // Auth.oauthDialogeGet(req.swagger.params, res, next);
}

export async function oauthAccessTokenPost (req, res, next) {
  // oauth2.token.forEach(function(func){
  //    func(req, res, next);
  // });
    console.log(res.statusCode);
    console.log(JSON.stringify(res.headers));
    console.log(res.body);
    // next();
  // Auth.oauthAccessTokenPost(req.swagger.params, res, next);
}
