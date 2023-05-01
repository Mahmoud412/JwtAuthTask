package com.jwtauthtask

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import org.json.JSONObject

class JoseModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext){
    override fun getName(): String = "JoseModule"

    @ReactMethod
    fun verify(token: String, jwk: ReadableMap, promise: Promise) {
        try {
            val signedJWT = SignedJWT.parse(token)
            val jwkString = JSONObject(jwk.toHashMap()).toString()
            val rsaJWK = RSAKey.parse(jwkString)
            val verifier = RSASSAVerifier(rsaJWK)
            verifier.jcaContext.provider = BouncyCastleProviderSingleton.getInstance()
            signedJWT.verify(verifier)
            val result = convertJsonToMap(JSONObject(signedJWT.payload.toJSONObject()))
            promise.resolve(result)
        } catch (ex: Exception) {
            promise.reject(ex)
        }
    }
}