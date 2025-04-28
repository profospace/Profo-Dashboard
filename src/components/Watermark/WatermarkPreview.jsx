import React, { useRef, useEffect } from 'react';

const WatermarkPreview = ({ previewImage, setPreviewImage, watermark }) => {
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !previewImage || !watermark) return;

        const ctx = canvas.getContext('2d');
        const baseImg = new Image();
        baseImg.src = previewImage;

        baseImg.onload = () => {
            canvas.width = baseImg.width;
            canvas.height = baseImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImg, 0, 0);

            if (watermark.type === 'image') {
                const wmImg = new Image();
                wmImg.src = watermark.url;
                wmImg.onload = () => {
                    const scale = 0.3;
                    const wmWidth = wmImg.width * scale;
                    const wmHeight = wmImg.height * scale;
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(wmImg, canvas.width - wmWidth - 20, canvas.height - wmHeight - 20, wmWidth, wmHeight);
                    ctx.globalAlpha = 1.0;
                };
            } else {
                ctx.globalAlpha = 0.5;
                ctx.font = '32px sans-serif';
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillText(watermark.text, canvas.width - 200, canvas.height - 40);
                ctx.globalAlpha = 1.0;
            }
        };
    }, [previewImage, watermark]);

    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
            />
            <div className="overflow-auto border rounded">
                <canvas ref={canvasRef} className="max-w-full" />
            </div>
        </div>
    );
};

export default WatermarkPreview;
