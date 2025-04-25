import type { Adapter, AdapterUser, AdapterSession, VerificationToken } from "next-auth/adapters"
import type { SanityClient } from "@sanity/client"
import { v4 as uuidv4 } from "uuid"

const SanityAdapter = (client: SanityClient): Adapter => {
  return {
    async createUser(user) {
      const newUser = {
        _id: `user.${uuidv4()}`,
        _type: "user",
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
        image: user.image,
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await client.create(newUser)
      return {
        id: result._id,
        name: result.name,
        email: result.email,
        emailVerified: result.emailVerified ? new Date(result.emailVerified) : null,
        image: result.image,
        role: result.role || "customer"
      } as unknown as AdapterUser
    },

    async getUser(id) {
      if (!id) return null
      
      const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, { id })
      if (!user) return null

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        role: user.role || "customer"
      } as unknown as AdapterUser
    },

    async getUserByEmail(email) {
      if (!email) return null
      
      const user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email })
      if (!user) return null

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        role: user.role || "customer"
      } as unknown as AdapterUser
    },

    async getUserByAccount({ providerAccountId, provider }) {
      if (!providerAccountId || !provider) return null
      
      try {
        const account = await client.fetch(
          `*[_type == "account" && provider == $provider && providerAccountId == $providerAccountId][0]{
            "user": *[_type == "user" && _id == ^.userId][0]
          }`,
          { provider, providerAccountId },
        )

        if (!account?.user) return null

        return {
          id: account.user._id,
          name: account.user.name,
          email: account.user.email,
          emailVerified: account.user.emailVerified ? new Date(account.user.emailVerified) : null,
          image: account.user.image,
          role: account.user.role || "customer"
        } as unknown as AdapterUser
      } catch (error) {
        console.error('Error in getUserByAccount:', error)
        return null
      }
    },

    async updateUser(user) {
      if (!user || !user.id) {
        throw new Error("User ID is required")
      }
      
      try {
        const updatedUser = {
          _id: user.id,
          _type: "user",
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
          image: user.image,
          updatedAt: new Date().toISOString(),
        }

        const result = await client.patch(user.id).set(updatedUser).commit()

        return {
          id: result._id,
          name: result.name,
          email: result.email,
          emailVerified: result.emailVerified ? new Date(result.emailVerified) : null,
          image: result.image,
          role: result.role || "customer"
        } as unknown as AdapterUser
      } catch (error) {
        console.error('Error in updateUser:', error)
        throw new Error("Failed to update user")
      }
    },

    async deleteUser(userId) {
      if (!userId) return
      
      try {
        // ลบบัญชีที่เกี่ยวข้องก่อน
        await client.delete({ query: `*[_type == "account" && userId == $userId]`, params: { userId } })
        // ลบเซสชันที่เกี่ยวข้อง
        await client.delete({ query: `*[_type == "session" && userId == $userId]`, params: { userId } })
        // ลบผู้ใช้
        await client.delete({ query: `*[_id == $userId][0]._id`, params: { userId } })
      } catch (error) {
        console.error('Error in deleteUser:', error)
      }
    },

    async linkAccount(account) {
      if (!account) return
      
      try {
        const newAccount = {
          _id: `account.${uuidv4()}`,
          _type: "account",
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await client.create(newAccount)
      } catch (error) {
        console.error('Error in linkAccount:', error)
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      if (!providerAccountId || !provider) return
      
      try {
        await client.delete({ 
          query: `*[_type == "account" && provider == $provider && providerAccountId == $providerAccountId][0]._id`,
          params: { provider, providerAccountId }
        })
      } catch (error) {
        console.error('Error in unlinkAccount:', error)
      }
    },

    async createSession(session) {
      if (!session) {
        throw new Error("Session data is required")
      }
      
      try {
        const newSession = {
          _id: `session.${uuidv4()}`,
          _type: "session",
          userId: session.userId,
          expires: new Date(session.expires).toISOString(),
          sessionToken: session.sessionToken,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const result = await client.create(newSession)
        return {
          sessionToken: result.sessionToken,
          userId: result.userId,
          expires: new Date(result.expires),
        } as unknown as AdapterSession
      } catch (error) {
        console.error('Error in createSession:', error)
        throw new Error("Failed to create session")
      }
    },

    async getSessionAndUser(sessionToken) {
      if (!sessionToken) {
        console.error('No sessionToken provided to getSessionAndUser')
        return null
      }

      try {
        const result = await client.fetch(
          `*[_type == "session" && sessionToken == $sessionToken && expires > now()][0]{
            _id,
            userId,
            expires,
            sessionToken,
            "user": *[_type == "user" && _id == ^.userId][0]{
              _id,
              name,
              email,
              emailVerified,
              image,
              role
            }
          }`,
          { sessionToken },
        )

        if (!result) {
          console.error('No session found with token:', sessionToken)
          return null
        }

        if (!result.user) {
          console.error('Session found but no user data:', result._id)
          return null
        }

        return {
          session: {
            userId: result.userId,
            expires: new Date(result.expires),
            sessionToken: result.sessionToken,
          } as unknown as AdapterSession,
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            emailVerified: result.user.emailVerified ? new Date(result.user.emailVerified) : null,
            image: result.user.image,
            role: result.user.role || "customer"
          } as unknown as AdapterUser,
        }
      } catch (error) {
        console.error('Error in getSessionAndUser:', error)
        return null
      }
    },

    async updateSession(session) {
      if (!session || !session.sessionToken) {
        console.error('Invalid session or sessionToken in updateSession')
        return null
      }

      try {
        const updatedSession = {
          expires: session.expires ? new Date(session.expires).toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        }

        // แก้ไขการใช้ patch และ commit
        const sessionDocQuery = await client.fetch(
          `*[_type == "session" && sessionToken == $sessionToken][0]._id`, 
          { sessionToken: session.sessionToken }
        )
        
        if (!sessionDocQuery) {
          console.error('Session not found:', session.sessionToken)
          return null
        }

        const result = await client
          .patch(sessionDocQuery)
          .set(updatedSession)
          .commit()

        return {
          sessionToken: result.sessionToken,
          userId: result.userId,
          expires: new Date(result.expires),
        } as unknown as AdapterSession
      } catch (error) {
        console.error('Error updating session:', error)
        return null
      }
    },

    async deleteSession(sessionToken) {
      if (!sessionToken) return
      
      try {
        await client.delete({ 
          query: `*[_type == "session" && sessionToken == $sessionToken][0]._id`,
          params: { sessionToken }
        })
      } catch (error) {
        console.error('Error in deleteSession:', error)
      }
    },

    async createVerificationToken(token) {
      if (!token) {
        throw new Error("Verification token data is required")
      }
      
      try {
        // สร้างไอดีเพื่อให้แน่ใจว่ามีการใช้ ID ที่ถูกต้อง
        const verificationToken = {
          _id: `verificationToken.${uuidv4()}`,
          _type: "verificationToken",
          identifier: token.identifier,
          token: token.token,
          expires: token.expires.toISOString(),
          createdAt: new Date().toISOString(),
        }
        
        const result = await client.create(verificationToken)
        return {
          identifier: result.identifier,
          token: result.token,
          expires: new Date(result.expires),
        } as unknown as VerificationToken
      } catch (error) {
        console.error('Error in createVerificationToken:', error)
        throw new Error("Failed to create verification token")
      }
    },

    async useVerificationToken(params) {
      if (!params || !params.identifier || !params.token) {
        console.error('Invalid verification token params')
        return null
      }
      
      try {
        // ตรวจสอบว่ามีโทเค็นที่ตรงกับเงื่อนไขหรือไม่
        const result = await client.fetch(
          `*[_type == "verificationToken" && identifier == $identifier && token == $tokenValue][0]`, 
          { 
            identifier: params.identifier, 
            tokenValue: params.token 
          }
        )
        
        if (!result) return null
        
        // ลบโทเค็นหลังจากใช้งาน
        await client.delete(result._id)
        
        return {
          identifier: result.identifier,
          token: result.token,
          expires: new Date(result.expires),
        } as unknown as VerificationToken
      } catch (error) {
        console.error('Error in useVerificationToken:', error)
        return null
      }
    }
  }
}

export default SanityAdapter

