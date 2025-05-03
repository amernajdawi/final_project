###############################################
# Stage 1: Build (The Builder)               #
###############################################
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

###############################################
# Stage 2: Production (The Runner)           #
###############################################
FROM node:18-alpine AS runner

# 1. Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# 2. Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# 3. Copy built assets from builder
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public  # Removed this line as /app/public was not found
COPY --from=builder /app/next.config.js ./

# 4. Set correct permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
