import { getServerSupabase } from '@/lib/db';
import { MAX_INCOME_AMOUNT } from '@/lib/constants';
    import { NextResponse } from 'next/server';

    export async function POST(req: Request) {
      try {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        const supabase = getServerSupabase(token);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        const { amount, category, title, note, occurred_at } = await req.json();

        // server-side guard: validate amount and enforce max income limit
        const amt = Number(amount);
        if (!Number.isFinite(amt) || Math.abs(amt) <= 0) {
          return new NextResponse(JSON.stringify({ error: 'Invalid amount' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (Math.abs(amt) > MAX_INCOME_AMOUNT) {
          return new NextResponse(JSON.stringify({ error: `Income exceeds the allowed limit (₹${MAX_INCOME_AMOUNT.toLocaleString()}).` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { data, error } = await supabase
          .from('incomes')
          .insert([
            {
              user_id: user.id,
              amount,
              category,
              title,
              description: note,
              occurred_at,
            },
          ])
          .select();

        if (error) {
          console.error(error);
          return new NextResponse(JSON.stringify({ error: 'Failed to create income' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        return NextResponse.json({ data });
      } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    export async function GET(req: Request) {
      try {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        const supabase = getServerSupabase(token);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        const { data, error } = await supabase
          .from('incomes')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error(error);
          return new NextResponse(JSON.stringify({ error: 'Failed to fetch incomes' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }

        return NextResponse.json({ data });
      } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
