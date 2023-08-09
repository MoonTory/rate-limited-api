local userKey = KEYS[1]
local weight = tonumber(ARGV[1])
local maxTokens = tonumber(ARGV[2])
local refillRate = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

-- Get the current token count and last refill timestamp
local tokenCount = tonumber(redis.call('hget', userKey, 'tokenCount') or maxTokens)
local lastRefill = tonumber(redis.call('hget', userKey, 'lastRefill') or now)

-- Calculate tokens to add since the last refill
local elapsed = now - lastRefill
local tokensToAdd = math.floor(elapsed * refillRate)
local newTokenCount = math.min(tokenCount + tokensToAdd, maxTokens)

-- Check if the user can proceed with the request
if newTokenCount < weight then
	return {newTokenCount - weight, lastRefill} -- Negative means they can't proceed, gives amount over limit
else
    redis.call('hset', userKey, 'tokenCount', newTokenCount - weight)
    redis.call('hset', userKey, 'lastRefill', now)
    return newTokenCount - weight -- Positive means they can proceed, gives tokens remaining after request
end
