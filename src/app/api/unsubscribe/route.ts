import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn('Resend initialization failed during build:', error);
}

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Remove from Resend audience if configured
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.remove({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (error: any) {
        // Handle case where email doesn't exist
        if (!error.message?.includes('not found')) {
          console.error('Failed to remove from audience:', error);
          return NextResponse.json(
            { error: 'Failed to unsubscribe. Please try again.' },
            { status: 500 }
          );
        }
      }
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'Manic Agency <team@manic.agency>',
        to: email,
        subject: 'Unsubscribed Successfully',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #3a2f25;">
            <h1 style="color: #b66880; font-size: 24px; margin-bottom: 20px;">You've Been Unsubscribed</h1>
            <p>We've successfully removed <strong>${email}</strong> from our mailing list.</p>
            <p>We're sorry to see you go! If you change your mind, you can always resubscribe at <a href="https://manic.agency" style="color: #b66880;">manic.agency</a>.</p>
            <p>If you have any feedback about why you unsubscribed, we'd love to hear from you at <a href="mailto:team@manic.agency" style="color: #b66880;">team@manic.agency</a>.</p>
            <p style="color: #7a6d60; font-size: 14px; margin-top: 30px;">
              — The Manic Team
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send unsubscribe confirmation:', error);
      // Don't fail the unsubscribe if confirmation email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed!' 
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  // Create a simple unsubscribe page
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Unsubscribe - Manic Agency</title>
      <style>
        body { 
          font-family: Inter, sans-serif; 
          max-width: 500px; 
          margin: 50px auto; 
          padding: 20px; 
          color: #3a2f25;
          line-height: 1.6;
        }
        .container {
          background: #fbf6ef;
          padding: 40px;
          border-radius: 20px;
          border: 1px solid #ede4d6;
        }
        h1 { color: #b66880; margin-bottom: 20px; }
        button {
          background: #b66880;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        }
        button:hover { background: #a55971; }
        .success { color: #7ea196; font-weight: 600; }
        .error { color: #d07676; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Unsubscribe from Manic Agency</h1>
        <p>Are you sure you want to unsubscribe <strong>${email}</strong> from our newsletter?</p>
        
        <div id="form">
          <button onclick="unsubscribe()">Yes, Unsubscribe Me</button>
          <p><a href="https://manic.agency">← Back to Manic Agency</a></p>
        </div>
        
        <div id="result" style="display: none;"></div>
      </div>
      
      <script>
        async function unsubscribe() {
          const button = document.querySelector('button');
          button.disabled = true;
          button.textContent = 'Unsubscribing...';
          
          try {
            const response = await fetch('/api/unsubscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: '${email}',
                token: '${token}' 
              })
            });
            
            const data = await response.json();
            const result = document.getElementById('result');
            const form = document.getElementById('form');
            
            if (response.ok) {
              result.innerHTML = '<p class="success">✓ Successfully unsubscribed! You will no longer receive emails from us.</p>';
              form.style.display = 'none';
            } else {
              result.innerHTML = '<p class="error">Failed to unsubscribe: ' + data.error + '</p>';
              button.disabled = false;
              button.textContent = 'Yes, Unsubscribe Me';
            }
            result.style.display = 'block';
          } catch (error) {
            const result = document.getElementById('result');
            result.innerHTML = '<p class="error">Network error. Please try again.</p>';
            result.style.display = 'block';
            button.disabled = false;
            button.textContent = 'Yes, Unsubscribe Me';
          }
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
