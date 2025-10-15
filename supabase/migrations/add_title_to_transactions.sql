/*
    # Add title column to transactions table

    1. Modified Tables
      - `transactions`
        - Added `title` column (text, optional)

    2. Summary
      - This migration adds a `title` column to the `transactions` table.
      - The `title` column is of type `text` and is nullable.
      - This column will be used to store a title for each transaction.
    */

    ALTER TABLE IF EXISTS transactions
    ADD COLUMN IF NOT EXISTS title text;
