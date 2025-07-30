#!/usr/bin/env node

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');
const path = require('path');
const fs = require('fs');

class PlaywrightMCPClient {
    constructor() {
        this.client = null;
        this.transport = null;
        this.connected = false;
    }

    async connect() {
        console.log('🔌 Connecting to Playwright MCP server...');
        
        try {
            // Create SSE transport to connect to the MCP server
            this.transport = new SSEClientTransport('http://localhost:8931/sse');
            this.client = new Client(
                {
                    name: "pdf-analyzer-client",
                    version: "1.0.0"
                },
                {
                    capabilities: {
                        tools: {},
                        resources: {},
                        prompts: {}
                    }
                }
            );

            await this.client.connect(this.transport);
            this.connected = true;
            console.log('✅ Connected to Playwright MCP server!');
            
            // List available tools
            const tools = await this.client.listTools();
            console.log('🛠️  Available tools:', tools.tools.map(t => t.name).join(', '));
            
            return true;
        } catch (error) {
            console.error('❌ Connection failed:', error.message);
            console.log('💡 Make sure Playwright MCP is running: npx @playwright/mcp@latest --port 8931 --caps vision,pdf');
            return false;
        }
    }

    async navigateToFile(filePath) {
        if (!this.connected) {
            throw new Error('Not connected to MCP server');
        }

        console.log(`📄 Loading PDF: ${filePath}`);
        
        try {
            // Convert file path to file:// URL
            const absolutePath = path.resolve(filePath);
            const fileUrl = `file:///${absolutePath.replace(/\\/g, '/')}`;
            
            console.log(`🌐 File URL: ${fileUrl}`);
            
            // Navigate to the PDF
            const result = await this.client.callTool({
                name: 'browser_navigate',
                arguments: {
                    url: fileUrl
                }
            });
            
            console.log('✅ PDF loaded successfully');
            return result;
        } catch (error) {
            console.error('❌ Failed to load PDF:', error.message);
            throw error;
        }
    }

    async takeScreenshot() {
        if (!this.connected) {
            throw new Error('Not connected to MCP server');
        }

        console.log('📸 Taking screenshot...');
        
        try {
            const result = await this.client.callTool({
                name: 'browser_take_screenshot',
                arguments: {
                    filename: 'ppt-clase1-screenshot.png',
                    fullPage: true
                }
            });
            
            console.log('✅ Screenshot saved!');
            return result;
        } catch (error) {
            console.error('❌ Screenshot failed:', error.message);
            throw error;
        }
    }

    async getPageSnapshot() {
        if (!this.connected) {
            throw new Error('Not connected to MCP server');
        }

        console.log('📋 Getting page accessibility snapshot...');
        
        try {
            const result = await this.client.callTool({
                name: 'browser_snapshot',
                arguments: {}
            });
            
            console.log('✅ Page snapshot captured!');
            return result;
        } catch (error) {
            console.error('❌ Snapshot failed:', error.message);
            throw error;
        }
    }

    async extractText() {
        if (!this.connected) {
            throw new Error('Not connected to MCP server');
        }

        console.log('📝 Extracting text content...');
        
        try {
            // Get page snapshot which contains accessibility tree with text
            const snapshot = await this.getPageSnapshot();
            
            if (snapshot.content && snapshot.content[0] && snapshot.content[0].text) {
                const text = snapshot.content[0].text;
                console.log('✅ Text extracted successfully!');
                return text;
            } else {
                console.log('⚠️  No text content found in snapshot');
                return null;
            }
        } catch (error) {
            console.error('❌ Text extraction failed:', error.message);
            throw error;
        }
    }

    async saveToPDF(filename = 'analyzed-ppt-clase1.pdf') {
        if (!this.connected) {
            throw new Error('Not connected to MCP server');
        }

        console.log(`💾 Saving analysis to PDF: ${filename}`);
        
        try {
            const result = await this.client.callTool({
                name: 'browser_pdf_save',
                arguments: {
                    filename: filename
                }
            });
            
            console.log('✅ PDF saved successfully!');
            return result;
        } catch (error) {
            console.error('❌ PDF save failed:', error.message);
            throw error;
        }
    }

    parseFormulas(text) {
        console.log('🔍 Parsing formulas from extracted text...');
        
        const formulas = {
            base: {},
            positive: {},
            negative: {},
            special: {}
        };

        // Extract base formulas
        const basePatterns = [
            { key: 'A', pattern: /A[=:]?\s*(MES|mes).*?(reducido|REDUCIDO)/i, description: 'Tarea no aprendida' },
            { key: 'B', pattern: /B[=:]?\s*(DÍA|dia|DIA).*?(reducido|REDUCIDO)/i, description: 'Mi esencia' },
            { key: 'C', pattern: /C[=:]?\s*(AÑO|ano|YEAR).*?(reducido|REDUCIDO)/i, description: 'Mi vida pasada' }
        ];

        basePatterns.forEach(({ key, pattern, description }) => {
            if (pattern.test(text)) {
                formulas.base[key] = {
                    formula: `${key} = ${key === 'A' ? 'MES' : key === 'B' ? 'DÍA' : 'AÑO'} (reducido)`,
                    description,
                    found: true
                };
                console.log(`✅ Found base formula: ${key}`);
            }
        });

        // Extract positive formulas
        const positivePatterns = [
            { key: 'D', pattern: /D[=:]?\s*A\s*\+\s*B\s*\+\s*C/i, description: 'Mi máscara' },
            { key: 'E', pattern: /E[=:]?\s*A\s*\+\s*B/i, description: 'Implantación del programa' },
            { key: 'F', pattern: /F[=:]?\s*B\s*\+\s*C/i, description: 'Encuentro con tu maestro' },
            { key: 'G', pattern: /G[=:]?\s*E\s*\+\s*F/i, description: 'Re-identificación con tu yo' },
            { key: 'H', pattern: /H[=:]?\s*A\s*\+\s*C/i, description: 'Tu destino' },
            { key: 'I', pattern: /I[=:]?\s*E\s*\+\s*F\s*\+\s*G/i, description: 'Inconsciente' },
            { key: 'J', pattern: /J[=:]?\s*D\s*\+\s*H/i, description: 'Mi espejo' }
        ];

        positivePatterns.forEach(({ key, pattern, description }) => {
            if (pattern.test(text)) {
                formulas.positive[key] = {
                    formula: pattern.exec(text)[0],
                    description,
                    found: true
                };
                console.log(`✅ Found positive formula: ${key}`);
            }
        });

        // Extract negative formulas  
        const negativePatterns = [
            { key: 'K', pattern: /K[=:]?\s*\|?A\s*-\s*B\|?/i, description: 'Adolescencia' },
            { key: 'L', pattern: /L[=:]?\s*\|?B\s*-\s*C\|?/i, description: 'Juventud' },
            { key: 'M', pattern: /M[=:]?\s*.*?K.*?L/i, description: 'Adultez' },
            { key: 'N', pattern: /N[=:]?\s*\|?A\s*-\s*C\|?/i, description: 'Adulto mayor' },
            { key: 'O', pattern: /O[=:]?\s*M\s*\+\s*K\s*\+\s*L/i, description: 'Inconsciente negativo' }
        ];

        negativePatterns.forEach(({ key, pattern, description }) => {
            if (pattern.test(text)) {
                formulas.negative[key] = {
                    formula: pattern.exec(text)[0],
                    description,
                    found: true
                };
                console.log(`✅ Found negative formula: ${key}`);
            }
        });

        return formulas;
    }

    async analyzePDF(pdfPath) {
        console.log('🎭 Starting comprehensive PDF analysis...');
        
        const analysis = {
            file: pdfPath,
            timestamp: new Date().toISOString(),
            formulas: {},
            text: null,
            screenshots: [],
            status: 'analyzing'
        };

        try {
            // Step 1: Load the PDF
            await this.navigateToFile(pdfPath);
            
            // Step 2: Take screenshot for visual reference
            await this.takeScreenshot();
            analysis.screenshots.push('ppt-clase1-screenshot.png');
            
            // Step 3: Extract text content
            const text = await this.extractText();
            analysis.text = text;
            
            // Step 4: Parse formulas from text
            if (text) {
                analysis.formulas = this.parseFormulas(text);
                console.log('📊 Formula analysis complete!');
            }
            
            // Step 5: Save analysis as PDF
            await this.saveToPDF();
            
            analysis.status = 'completed';
            
            // Save analysis to JSON file
            const analysisFile = 'ppt-clase1-analysis.json';
            fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
            console.log(`💾 Analysis saved to: ${analysisFile}`);
            
            return analysis;
            
        } catch (error) {
            console.error('❌ PDF analysis failed:', error.message);
            analysis.status = 'failed';
            analysis.error = error.message;
            return analysis;
        }
    }

    async disconnect() {
        if (this.connected && this.transport) {
            await this.transport.close();
            this.connected = false;
            console.log('👋 Disconnected from MCP server');
        }
    }
}

// Main execution
async function main() {
    const client = new PlaywrightMCPClient();
    
    try {
        // Connect to MCP server
        const connected = await client.connect();
        if (!connected) {
            process.exit(1);
        }
        
        // Analyze the PDF
        const pdfPath = 'PPT CLASE 1.pdf';
        if (!fs.existsSync(pdfPath)) {
            console.error(`❌ PDF file not found: ${pdfPath}`);
            process.exit(1);
        }
        
        const analysis = await client.analyzePDF(pdfPath);
        
        // Display results
        console.log('\n🎉 Analysis Results:');
        console.log('==================');
        console.log(`Status: ${analysis.status}`);
        
        if (analysis.formulas) {
            console.log('\n📊 Detected Formulas:');
            
            if (Object.keys(analysis.formulas.base).length > 0) {
                console.log('\n🔢 Base Numbers:');
                Object.entries(analysis.formulas.base).forEach(([key, data]) => {
                    console.log(`  ${key}: ${data.formula} - ${data.description}`);
                });
            }
            
            if (Object.keys(analysis.formulas.positive).length > 0) {
                console.log('\n✨ Positive Calculations:');
                Object.entries(analysis.formulas.positive).forEach(([key, data]) => {
                    console.log(`  ${key}: ${data.formula} - ${data.description}`);
                });
            }
            
            if (Object.keys(analysis.formulas.negative).length > 0) {
                console.log('\n⚠️ Negative Calculations:');
                Object.entries(analysis.formulas.negative).forEach(([key, data]) => {
                    console.log(`  ${key}: ${data.formula} - ${data.description}`);
                });
            }
        }
        
        console.log('\n📁 Generated Files:');
        console.log('  - ppt-clase1-analysis.json (Complete analysis)');
        console.log('  - ppt-clase1-screenshot.png (Visual reference)');
        console.log('  - analyzed-ppt-clase1.pdf (Processed PDF)');
        
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
    } finally {
        await client.disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = PlaywrightMCPClient; 