const logout = async ( req, res ) =>{
    res.cookie("token", "",{
        httpOnly : true,
        expires : new Date(0)
    })
    res.status(200).json({
        status : "success",
        message : "user logged out successfully"
    })
}

export { logout };
