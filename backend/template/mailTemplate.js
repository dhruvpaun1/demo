export const mailHTMLTemplate= ({type="birthdayWish",receiverName,age=0})=>{
	const htmlTemplate=`
    <div style="background: #f0f2f5; padding: 50px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            <tr>
                <td style="background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); height: 10px;"></td>
            </tr>
            <tr>
                <td style="padding: 40px 30px; text-align: center;">
                    <span style="font-size: 50px;">✨</span>
                    <h1 style="color: #1a1a1a; font-size: 28px; margin: 20px 0 10px 0;">Happy Birthday, ${receiverName}!</h1>
                    <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Today is a milestone worth celebrating.</p>
                    <div style="display: inline-block; margin-bottom: 30px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="background: #fff0f3; border: 2px dashed #f5576c; border-radius: 100px; padding: 20px 40px;">
                                    <span style="font-size: 42px; font-weight: 900; color: #f5576c;">${age}</span>
                                    <span style="display: block; font-size: 12px; color: #f5576c; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Years Old</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <p style="color: #444; font-size: 16px; line-height: 1.6;">
                        Wishing you a day as incredible as the journey you've had over the last ${age} years. Keep shining!
                    </p>
                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 14px; margin: 0;">Warmest wishes,</p>
                        <p style="color: #1a1a1a; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">The Team</p>
                    </div>
                </td>
            </tr>
        </table>
    </div>`;
	return htmlTemplate
}