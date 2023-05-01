package com.jwtauthtask.jose

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.crypto.RSASSAVerifier
import com.nimbusds.jose.crypto.bc.BouncyCastleProviderSingleton
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jwt.SignedJWT
import org.json.JSONObject

class JoseModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "JoseModule"

    @ReactMethod
    fun verify(token: String, jwk: ReadableMap, promise: Promise) {
        try {
            val signedJWT = SignedJWT.parse(token)
            val jwkString = JSONObject(jwk.toHashMap()).toString()
            val rsaJWK = RSAKey.parse(jwkString)
            val verifier = RSASSAVerifier(rsaJWK).apply {
                jcaContext.provider = BouncyCastleProviderSingleton.getInstance()
            }
            val isValid = signedJWT.verify(verifier)
            if (isValid) {
                promise.resolve(
                    convertJsonToMap(JSONObject(signedJWT.payload.toJSONObject()))
                )
                return
            }
            promise.reject(JOSEException("Invalid JWT signature"))
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}